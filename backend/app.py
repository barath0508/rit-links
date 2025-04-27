from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import cv2
import pytesseract
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
import tempfile
from werkzeug.utils import secure_filename
import requests
import re

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase (in a real app, use environment variables)
# Note: This is a placeholder. You should use proper credentials
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'rit-links-in.appspot.com'
})
db = firestore.client()
bucket = storage.bucket()

# Setup path to tesseract executable
# Note: This path may need to be adjusted based on the deployment environment
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "API is running"})

@app.route('/api/register', methods=['POST'])
def register_user():
    """Register a new user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        name = data.get('name')
        
        if not all([email, password, role, name]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Create user in Firebase Authentication
        user = auth.create_user(
            email=email,
            password=password,
            display_name=name
        )
        
        # Create user document in Firestore
        db.collection('users').document(user.uid).set({
            'email': email,
            'role': role,
            'name': name,
            'createdAt': firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({"message": "User registered successfully", "uid": user.uid}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/skills', methods=['POST'])
def add_skill():
    """Add a new skill for a student with certification verification"""
    try:
        # Extract user ID from the authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized"}), 401
        
        token = auth_header.split('Bearer ')[1]
        user = auth.verify_id_token(token)
        user_id = user['uid']
        
        # Check if user is a student
        user_doc = db.collection('users').document(user_id).get()
        if not user_doc.exists or user_doc.to_dict().get('role') != 'student':
            return jsonify({"error": "Only students can add skills"}), 403
        
        # Get form data
        skill_name = request.form.get('skill_name')
        skill_level = request.form.get('skill_level')
        projects_count = request.form.get('projects_count')
        github_repo = request.form.get('github_repo')
        
        if not all([skill_name, skill_level, projects_count]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Process certification file
        if 'certification' not in request.files:
            return jsonify({"error": "No certification file provided"}), 400
            
        cert_file = request.files['certification']
        if cert_file.filename == '':
            return jsonify({"error": "No certification file selected"}), 400
            
        # Save file temporarily
        temp_dir = tempfile.gettempdir()
        filename = secure_filename(cert_file.filename)
        filepath = os.path.join(temp_dir, filename)
        cert_file.save(filepath)
        
        # Verify certification using Tesseract OCR
        verification_result = verify_certification(filepath, skill_name)
        
        # Upload file to Firebase Storage
        upload_path = f"certifications/{user_id}/{filename}"
        blob = bucket.blob(upload_path)
        blob.upload_from_filename(filepath)
        
        # Make the blob publicly readable
        blob.make_public()
        cert_url = blob.public_url
        
        # Remove temporary file
        os.remove(filepath)
        
        # Calculate skill score based on certification, projects count and GitHub verification
        skill_score = calculate_skill_score(
            verification_result['verified'], 
            int(projects_count), 
            github_repo
        )
        
        # Save skill to Firestore
        skill_data = {
            'name': skill_name,
            'level': skill_level,
            'projectsCount': int(projects_count),
            'githubRepo': github_repo,
            'certificationUrl': cert_url,
            'verified': verification_result['verified'],
            'verificationDetails': verification_result['details'],
            'score': skill_score,
            'createdAt': firestore.SERVER_TIMESTAMP
        }
        
        # Add to skills collection
        db.collection('users').document(user_id).collection('skills').add(skill_data)
        
        # Update user's skills array
        user_ref = db.collection('users').document(user_id)
        user = user_ref.get().to_dict()
        
        if 'skills' not in user or not user['skills']:
            user_ref.update({'skills': [skill_name]})
        elif skill_name not in user['skills']:
            user_ref.update({'skills': firestore.ArrayUnion([skill_name])})
        
        return jsonify({
            "message": "Skill added successfully",
            "skill": skill_data,
            "score": skill_score
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def verify_certification(filepath, skill_name):
    """Verify a certification using OCR"""
    try:
        # Read image
        img = cv2.imread(filepath)
        
        # Preprocess image
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Apply OCR
        text = pytesseract.image_to_string(thresh)
        
        # Check if skill name is in the text
        skill_name_lower = skill_name.lower()
        text_lower = text.lower()
        
        # Check for common certification keywords
        cert_keywords = ['certificate', 'certification', 'awarded', 'completed', 'achievement']
        
        has_skill_name = skill_name_lower in text_lower
        has_cert_keyword = any(keyword in text_lower for keyword in cert_keywords)
        
        verified = has_skill_name and has_cert_keyword
        
        details = {
            "text_extracted": text,
            "contains_skill_name": has_skill_name,
            "contains_cert_keywords": has_cert_keyword,
            "confidence": 0.85 if verified else 0.4
        }
        
        return {
            "verified": verified,
            "details": details
        }
    
    except Exception as e:
        return {
            "verified": False,
            "details": {"error": str(e)}
        }

def calculate_skill_score(certification_verified, projects_count, github_repo=None):
    """Calculate a skill score based on certification, projects and GitHub activity"""
    base_score = 0
    
    # Points for verified certification
    if certification_verified:
        base_score += 40
    
    # Points for projects
    project_points = min(projects_count * 10, 30)  # Cap at 30 points for projects
    base_score += project_points
    
    # Points for GitHub verification (simplified, would need GitHub API in real app)
    github_points = 0
    if github_repo:
        try:
            # Basic validation of GitHub repo format
            if re.match(r'https?://github\.com/[\w-]+/[\w-]+', github_repo):
                # This would use GitHub API in a real app
                github_points = 30
        except:
            github_points = 0
    
    base_score += github_points
    
    return base_score

@app.route('/api/projects', methods=['POST'])
def add_project():
    """Add a new project (faculty only)"""
    try:
        # Extract user ID from the authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized"}), 401
        
        token = auth_header.split('Bearer ')[1]
        user = auth.verify_id_token(token)
        user_id = user['uid']
        
        # Check if user is faculty
        user_doc = db.collection('users').document(user_id).get()
        if not user_doc.exists or user_doc.to_dict().get('role') != 'faculty':
            return jsonify({"error": "Only faculty can add projects"}), 403
        
        # Get project details
        data = request.json
        title = data.get('title')
        description = data.get('description')
        required_skills = data.get('required_skills', [])
        duration = data.get('duration')
        max_students = data.get('max_students', 1)
        
        if not all([title, description, required_skills, duration]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Create project document
        faculty_name = user_doc.to_dict().get('name', 'Faculty')
        
        project_data = {
            'title': title,
            'description': description,
            'required_skills': required_skills,
            'duration': duration,
            'max_students': max_students,
            'faculty_id': user_id,
            'faculty_name': faculty_name,
            'status': 'Open',
            'students': [],
            'created_at': firestore.SERVER_TIMESTAMP
        }
        
        # Add to projects collection
        project_ref = db.collection('projects').add(project_data)
        
        return jsonify({
            "message": "Project added successfully",
            "project_id": project_ref[1].id
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students/search', methods=['GET'])
def search_students():
    """Search for students based on skills"""
    try:
        # Extract user ID from the authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized"}), 401
        
        token = auth_header.split('Bearer ')[1]
        user = auth.verify_id_token(token)
        user_id = user['uid']
        
        # Check if user is faculty
        user_doc = db.collection('users').document(user_id).get()
        if not user_doc.exists or user_doc.to_dict().get('role') != 'faculty':
            return jsonify({"error": "Only faculty can search students"}), 403
        
        # Get search parameters
        skill = request.args.get('skill')
        limit = int(request.args.get('limit', 10))
        
        if not skill:
            return jsonify({"error": "Skill parameter is required"}), 400
        
        # Query users with the specified skill
        users_ref = db.collection('users')
        users_with_skill = users_ref.where('role', '==', 'student').where('skills', 'array_contains', skill).get()
        
        # Get detailed skill info and calculate scores
        students = []
        for user_doc in users_with_skill:
            user_data = user_doc.to_dict()
            user_id = user_doc.id
            
            # Get skill details
            skills_ref = db.collection('users').document(user_id).collection('skills')
            user_skills = skills_ref.where('name', '==', skill).get()
            
            skill_data = None
            for skill_doc in user_skills:
                skill_data = skill_doc.to_dict()
                break
                
            if skill_data:
                student = {
                    'id': user_id,
                    'name': user_data.get('name', 'Unknown'),
                    'email': user_data.get('email', ''),
                    'department': user_data.get('department', ''),
                    'skill': {
                        'name': skill,
                        'score': skill_data.get('score', 0),
                        'projectsCount': skill_data.get('projectsCount', 0),
                        'verified': skill_data.get('verified', False)
                    }
                }
                students.append(student)
        
        # Sort by skill score in descending order
        students.sort(key=lambda x: x['skill']['score'], reverse=True)
        
        # Limit results
        students = students[:limit]
        
        return jsonify({"students": students})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects/apply', methods=['POST'])
def apply_for_project():
    """Student applies for a project"""
    try:
        # Extract user ID from the authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized"}), 401
        
        token = auth_header.split('Bearer ')[1]
        user = auth.verify_id_token(token)
        user_id = user['uid']
        
        # Check if user is a student
        user_doc = db.collection('users').document(user_id).get()
        if not user_doc.exists or user_doc.to_dict().get('role') != 'student':
            return jsonify({"error": "Only students can apply for projects"}), 403
        
        # Get application details
        data = request.json
        project_id = data.get('project_id')
        
        if not project_id:
            return jsonify({"error": "Project ID is required"}), 400
        
        # Get project
        project_ref = db.collection('projects').document(project_id)
        project = project_ref.get()
        
        if not project.exists:
            return jsonify({"error": "Project not found"}), 404
            
        project_data = project.to_dict()
        
        # Check if project is open
        if project_data.get('status') != 'Open':
            return jsonify({"error": "Project is not accepting applications"}), 400
            
        # Check if student already applied
        student_applications_ref = db.collection('applications')
        existing_application = student_applications_ref.where('student_id', '==', user_id).where('project_id', '==', project_id).get()
        
        if len(list(existing_application)) > 0:
            return jsonify({"error": "You have already applied for this project"}), 400
        
        # Create application
        student_data = user_doc.to_dict()
        application_data = {
            'project_id': project_id,
            'project_title': project_data.get('title'),
            'student_id': user_id,
            'student_name': student_data.get('name'),
            'faculty_id': project_data.get('faculty_id'),
            'status': 'Pending',
            'created_at': firestore.SERVER_TIMESTAMP
        }
        
        # Add to applications collection
        application_ref = db.collection('applications').add(application_data)
        
        return jsonify({
            "message": "Application submitted successfully",
            "application_id": application_ref[1].id
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentLayout from '../components/layouts/StudentLayout';
import FacultyLayout from '../components/layouts/FacultyLayout';
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { userProfile, userRole, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    department: '',
    skills: [] as string[],
    newSkill: '' // For adding new skills
  });
  
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        bio: userProfile.bio || '',
        department: userProfile.department || '',
        skills: userProfile.skills || [],
        newSkill: ''
      });
    }
  }, [userProfile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToUpdate = {
        name: formData.name,
        bio: formData.bio,
        department: formData.department,
        skills: formData.skills,
        updatedAt: new Date().toISOString()
      };
      
      await updateUserProfile(dataToUpdate);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };
  
  const Layout = userRole === 'student' ? StudentLayout : FacultyLayout;
  
  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center border-4 border-white overflow-hidden">
                <img
                  src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${formData.name}&size=128&background=random`}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">{formData.name}</h1>
                <p className="text-blue-100">{userRole === 'student' ? 'Student' : 'Faculty'}</p>
              </div>
              <div className="md:ml-auto mt-4 md:mt-0">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-md flex items-center hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-white text-gray-600 px-4 py-2 rounded-md flex items-center hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="form-input bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="form-label">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map((skill, index) => (
                      <div 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      name="newSkill"
                      value={formData.newSkill}
                      onChange={handleChange}
                      placeholder="Add a skill"
                      className="form-input rounded-r-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      Full Name
                    </h3>
                    <p className="text-gray-900 mt-1">{formData.name}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      Email
                    </h3>
                    <p className="text-gray-900 mt-1">{formData.email}</p>
                  </div>
                  {formData.department && (
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium">Department</h3>
                      <p className="text-gray-900 mt-1">{formData.department}</p>
                    </div>
                  )}
                  {formData.bio && (
                    <div className="md:col-span-2">
                      <h3 className="text-gray-500 text-sm font-medium">Bio</h3>
                      <p className="text-gray-900 mt-1">{formData.bio}</p>
                    </div>
                  )}
                </div>
                
                {formData.skills.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-gray-500 text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Account Information
                  </h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Member since</p>
                      <p className="text-gray-900">
                        {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last updated</p>
                      <p className="text-gray-900">
                        {userProfile?.updatedAt ? new Date(userProfile.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from '../../components/layouts/StudentLayout';
import { BarChart, CheckCircle, Clock, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { userProfile } = useAuth();

  // Sample data (would come from API in a real app)
  const stats = {
    totalProjects: 3,
    totalSeminars: 2,
    totalSkills: 5
  };

  const currentProjects = [
    {
      id: 1,
      title: 'IOT-based Attendance System',
      technology: 'Arduino',
      faculty: 'Santosh',
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Drones',
      technology: 'ML',
      faculty: 'Ram',
      status: 'In Progress'
    }
  ];

  const upcomingSeminars = [
    {
      id: 1,
      title: 'Vega V-3 Workshop',
      date: '20 April 2025',
      time: '2:00 PM',
      organization: 'RIT'
    },
    {
      id: 2,
      title: 'Introduction to Flutter',
      date: '30 April 2025',
      time: '1:30 PM',
      organization: 'RIT'
    }
  ];

  return (
    <StudentLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome {userProfile?.name || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your projects and skills
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-blue-500" />
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card">
              <span className="text-purple-700 font-semibold">Total Project Enrollment</span>
              <span className="text-3xl font-bold mt-2">{stats.totalProjects}</span>
            </div>
            <div className="stat-card">
              <span className="text-purple-700 font-semibold">Total Seminar Enrollment</span>
              <span className="text-3xl font-bold mt-2">{stats.totalSeminars}</span>
            </div>
            <div className="stat-card">
              <span className="text-purple-700 font-semibold">Total Skills</span>
              <span className="text-3xl font-bold mt-2">{stats.totalSkills}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Projects</h2>
              {currentProjects.length > 0 ? (
                <div className="space-y-4">
                  {currentProjects.map(project => (
                    <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {project.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center mt-1">
                          <span className="font-medium mr-2">Technology:</span> {project.technology}
                        </div>
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="font-medium mr-2">Faculty:</span> {project.faculty}
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You don't have any active projects yet.</p>
                  <Link to="/student/projects" className="text-blue-500 hover:underline mt-2 inline-block">
                    Find a project
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ongoing Seminars</h2>
              {upcomingSeminars.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSeminars.map(seminar => (
                    <div key={seminar.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-gray-900">{seminar.title}</h3>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {seminar.date} {seminar.time}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="font-medium mr-2">Organization:</span> {seminar.organization}
                        </div>
                      </div>
                      <div className="mt-3">
                        <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                          Join Seminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming seminars at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
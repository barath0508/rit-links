import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FacultyLayout from '../../components/layouts/FacultyLayout';
import { BarChart, CheckCircle, Clock, User, Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  const { userProfile } = useAuth();

  // Sample data (would come from API in a real app)
  const stats = {
    totalProjects: 2,
    totalSeminars: 3
  };

  const studentRequests = [
    {
      id: 1,
      title: 'IOT-based Attendance System',
      student: 'Suresh',
      skill: 'Basics of Arduino',
      status: 'Pending'
    }
  ];

  const upcomingSeminars = [
    {
      id: 1,
      title: 'Vega V-3 Workshop',
      date: '20 April 2025',
      time: '2:00 PM',
      attendees: 12
    },
    {
      id: 2,
      title: 'Introduction to Flutter',
      date: '30 April 2025',
      time: '1:30 PM',
      attendees: 8
    }
  ];

  return (
    <FacultyLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome {userProfile?.name || 'Faculty'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your projects and find skilled students
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-blue-500" />
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="stat-card">
              <span className="text-purple-700 font-semibold">Published Projects</span>
              <span className="text-3xl font-bold mt-2">{stats.totalProjects}</span>
            </div>
            <div className="stat-card">
              <span className="text-purple-700 font-semibold">Total Seminars</span>
              <span className="text-3xl font-bold mt-2">{stats.totalSeminars}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Requests</h2>
              {studentRequests.length > 0 ? (
                <div className="space-y-4">
                  {studentRequests.map(request => (
                    <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{request.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {request.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="font-medium mr-2">Student:</span> {request.student}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="font-medium mr-2">Skill:</span> {request.skill}
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Accept
                        </button>
                        <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center">
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Reject
                        </button>
                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending requests at the moment.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Seminars</h2>
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
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{seminar.attendees} attendees</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming seminars at the moment.</p>
                  <Link to="/faculty/seminars/create" className="text-blue-500 hover:underline mt-2 inline-block">
                    Create a seminar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
};

export default FacultyDashboard;
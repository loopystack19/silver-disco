'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  Briefcase,
  Clock,
  Users,
  Calendar,
  Award,
  ExternalLink,
  CheckCircle,
  Building,
  Globe,
  Code,
} from 'lucide-react';
import { Project } from '@/types/employment';
import ApplicationModal from '@/components/employment/ApplicationModal';

interface ProjectDetailProps {
  params: { id: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string>('');

  useEffect(() => {
    fetchProject();
    if (session) {
      checkApplicationStatus();
    }
  }, [params.id, session]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/employment/projects/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setProject(data.project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const res = await fetch('/api/employment/applications/my-applications');
      const data = await res.json();

      if (data.success) {
        const existingApp = data.applications.find(
          (app: any) => app.projectId === params.id
        );
        if (existingApp) {
          setHasApplied(true);
          setApplicationStatus(existingApp.status);
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApplyClick = () => {
    if (!session) {
      router.push(`/login?redirect=/employment/projects/${params.id}`);
      return;
    }
    setShowApplicationModal(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = () => {
    if (!hasApplied) return null;

    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-700', text: 'Application Pending' },
      approved: { color: 'bg-green-100 text-green-700', text: 'Application Approved' },
      rejected: { color: 'bg-red-100 text-red-700', text: 'Application Rejected' },
      'revision-requested': {
        color: 'bg-blue-100 text-blue-700',
        text: 'Revision Requested',
      },
    };

    const badge = badges[applicationStatus as keyof typeof badges];
    if (!badge) return null;

    return (
      <div className={`px-4 py-2 ${badge.color} rounded-lg text-sm font-semibold`}>
        {badge.text}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <button
            onClick={() => router.push('/employment')}
            className="text-purple-600 hover:underline"
          >
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push('/employment')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 ${getDifficultyColor(
                    project.difficulty
                  )} rounded-full text-sm font-semibold`}
                >
                  {project.difficulty}
                </span>
                <span
                  className={`px-3 py-1 ${
                    project.status === 'Open'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  } rounded-full text-sm font-semibold`}
                >
                  {project.status}
                </span>
                <span className="text-sm text-white/80">{project.category}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl text-purple-100 mb-6">{project.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  <span className="font-semibold">{project.organization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{project.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">
                    {project.currentTeamSize}/{project.maxTeamSize || '∞'} members
                  </span>
                </div>
                {project.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Application Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
                  <Briefcase className="w-16 h-16 text-white" />
                </div>

                {getStatusBadge()}

                {!hasApplied && project.status === 'Open' ? (
                  <button
                    onClick={handleApplyClick}
                    className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                  >
                    Apply to Join
                  </button>
                ) : hasApplied ? (
                  <button
                    onClick={() => router.push('/employment/my-applications')}
                    className="w-full mt-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                  >
                    View Application
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full mt-4 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
                  >
                    Project Closed
                  </button>
                )}

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Flexible schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Remote collaboration</span>
                  </div>
                  {project.certificate && (
                    <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                      <Award className="w-4 h-4" />
                      <span>Certificate upon completion</span>
                    </div>
                  )}
                </div>

                {project.sourceUrl && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline text-sm flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Original Project
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Details</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </div>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills Required</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.skills.map((skill) => (
                  <div key={skill} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Project Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Organization</p>
                  <p className="font-semibold text-gray-900">{project.organization}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900">{project.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">{project.duration}</p>
                </div>
                <div>
                  <p className="text-gray-600">Difficulty</p>
                  <p className="font-semibold text-gray-900">{project.difficulty}</p>
                </div>
                <div>
                  <p className="text-gray-600">Source</p>
                  <p className="font-semibold text-gray-900">{project.source}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          projectId={project.id}
          projectTitle={project.title}
          requiredSkills={project.skills}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={() => {
            setShowApplicationModal(false);
            setHasApplied(true);
            setApplicationStatus('pending');
          }}
        />
      )}
    </div>
  );
}

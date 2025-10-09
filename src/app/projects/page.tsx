'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Project, ProjectRole, ProjectDifficulty, DataSource } from '@/types/user';
import { Briefcase, Clock, Code, TrendingUp, Filter, Search } from 'lucide-react';

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    difficulty: '',
    dataSource: '',
    search: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.dataSource) params.append('dataSource', filters.dataSource);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: ProjectDifficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: ProjectRole) => {
    const colors: Record<string, string> = {
      'Data Analyst': 'bg-blue-100 text-blue-800',
      'UX Designer': 'bg-purple-100 text-purple-800',
      'Frontend Developer': 'bg-cyan-100 text-cyan-800',
      'Backend Developer': 'bg-indigo-100 text-indigo-800',
      'Full Stack Developer': 'bg-violet-100 text-violet-800',
      'Content Writer': 'bg-pink-100 text-pink-800',
      'Digital Marketer': 'bg-orange-100 text-orange-800',
      'Product Manager': 'bg-teal-100 text-teal-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Sprint Portfolio</h1>
              <p className="mt-2 text-gray-600">Build real-world experience with publicly available data</p>
            </div>
            <Link
              href="/dashboard/students"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[300px]">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by title, skills, or goal..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
              >
                <option value="">All Roles</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="UX Designer">UX Designer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Content Writer">Content Writer</option>
                <option value="Digital Marketer">Digital Marketer</option>
                <option value="Product Manager">Product Manager</option>
              </select>

              <select
                value={filters.dataSource}
                onChange={(e) => setFilters({ ...filters, dataSource: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
              >
                <option value="">All Data Sources</option>
                <option value="Kaggle">Kaggle</option>
                <option value="GitHub">GitHub</option>
                <option value="Public API">Public API</option>
                <option value="Open Dataset">Open Dataset</option>
                <option value="Research Paper">Research Paper</option>
              </select>

              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects available</h3>
            <p className="text-gray-600">Check back later or try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {project.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(project.role)}`}>
                      {project.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {project.skills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                          +{project.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{project.estimatedHours} hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      <span>{project.dataSource}</span>
                    </div>
                  </div>

                  {/* Goal Preview */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {project.projectGoal}
                  </p>

                  {/* Button */}
                  <Link
                    href={`/projects/${project.id}`}
                    className="block w-full px-4 py-2 bg-[#3DB2FF] text-white rounded-lg hover:bg-[#2A9DE8] transition-colors text-center font-semibold"
                  >
                    Start Sprint →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

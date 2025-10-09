'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ProjectManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: 'Data Analyst',
    difficulty: 'intermediate',
    dataSource: '',
    stakeholderBrief: '',
    stakeholderFeedback: '',
    mandatoryDeliverables: [''],
    estimatedHours: 20,
    skills: ['']
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        setProjects(await response.json());
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mandatoryDeliverables: formData.mandatoryDeliverables.filter(d => d.trim()),
          skills: formData.skills.filter(s => s.trim())
        })
      });

      if (response.ok) {
        alert('Project created successfully!');
        setShowForm(false);
        fetchProjects();
        // Reset form
        setFormData({
          title: '',
          description: '',
          role: 'Data Analyst',
          difficulty: 'intermediate',
          dataSource: '',
          stakeholderBrief: '',
          stakeholderFeedback: '',
          mandatoryDeliverables: [''],
          estimatedHours: 20,
          skills: ['']
        });
      } else {
        alert('Failed to create project');
      }
    } catch (error) {
      alert('Error creating project');
    }
  };

  const addDeliverable = () => {
    setFormData({
      ...formData,
      mandatoryDeliverables: [...formData.mandatoryDeliverables, '']
    });
  };

  const updateDeliverable = (index: number, value: string) => {
    const newDeliverables = [...formData.mandatoryDeliverables];
    newDeliverables[index] = value;
    setFormData({ ...formData, mandatoryDeliverables: newDeliverables });
  };

  const removeDeliverable = (index: number) => {
    setFormData({
      ...formData,
      mandatoryDeliverables: formData.mandatoryDeliverables.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ''] });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
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
              <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
              <p className="mt-2 text-gray-600">Create and manage project sprints</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-[#3DB2FF] text-white rounded-lg hover:bg-[#2A9DE8] flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {showForm ? 'Cancel' : 'New Project'}
              </button>
              <Link
                href="/dashboard/admin"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                  >
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Business Analyst">Business Analyst</option>
                    <option value="Web Developer">Web Developer</option>
                    <option value="Mobile Developer">Mobile Developer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Difficulty *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Estimated Hours *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Data Source URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://kaggle.com/..."
                  value={formData.dataSource}
                  onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Stakeholder Brief *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.stakeholderBrief}
                  onChange={(e) => setFormData({ ...formData, stakeholderBrief: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Stakeholder Feedback *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="This will be revealed after student reviews the brief..."
                  value={formData.stakeholderFeedback}
                  onChange={(e) => setFormData({ ...formData, stakeholderFeedback: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Mandatory Deliverables *</label>
                {formData.mandatoryDeliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      placeholder={`Deliverable ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                    />
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  + Add Deliverable
                </button>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Skills Required *</label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      placeholder={`Skill ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  + Add Skill
                </button>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#007F4E] text-white rounded-lg hover:bg-[#006A42] font-semibold"
              >
                Create Project
              </button>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No projects yet. Create your first one above!</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                          {project.role}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                          {project.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          {project.estimatedHours}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

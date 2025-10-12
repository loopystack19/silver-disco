'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X, Upload, Loader } from 'lucide-react';

interface ApplicationModalProps {
  projectId: string;
  projectTitle: string;
  requiredSkills: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplicationModal({
  projectId,
  projectTitle,
  requiredSkills,
  onClose,
  onSuccess,
}: ApplicationModalProps) {
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    institution: '',
    course: '',
    skills: [] as string[],
    statement: '',
    hoursPerWeek: 10,
    portfolioLink: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableSkills = [
    ...requiredSkills,
    'React',
    'Node.js',
    'Python',
    'TypeScript',
    'JavaScript',
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'AWS',
    'Git',
    'REST API',
    'GraphQL',
    'TensorFlow',
    'Machine Learning',
    'Data Analysis',
    'UI/UX Design',
    'Figma',
    'Flutter',
    'React Native',
    'Swift',
    'Kotlin',
  ];

  const uniqueSkills = [...new Set(availableSkills)];

  const handleSkillToggle = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((s) => s !== skill),
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course of study is required';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }

    if (!formData.statement.trim()) {
      newErrors.statement = 'Statement of interest is required';
    } else if (formData.statement.trim().length < 50) {
      newErrors.statement = 'Statement must be at least 50 characters';
    }

    if (formData.hoursPerWeek < 1 || formData.hoursPerWeek > 40) {
      newErrors.hoursPerWeek = 'Hours per week must be between 1 and 40';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/employment/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Application submitted successfully! You will be notified once reviewed.');
        onSuccess();
      } else {
        alert(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply for Project</h2>
            <p className="text-sm text-gray-600 mt-1">{projectTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University/Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., University of Nairobi"
            />
            {errors.institution && (
              <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
            )}
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course of Study <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Computer Science"
            />
            {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Select all skills you have relevant to this project
            </p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg">
              {uniqueSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    formData.skills.includes(skill)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
            {formData.skills.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {formData.skills.length} skill(s)
              </p>
            )}
          </div>

          {/* Statement of Interest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statement of Interest <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Explain why you're interested in this project and what you hope to gain (minimum
              50 characters)
            </p>
            <textarea
              value={formData.statement}
              onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="I'm passionate about this project because..."
            />
            <div className="flex justify-between items-center mt-1">
              {errors.statement && (
                <p className="text-red-500 text-sm">{errors.statement}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.statement.length} characters
              </p>
            </div>
          </div>

          {/* Hours Per Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Hours Per Week <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="40"
              value={formData.hoursPerWeek}
              onChange={(e) =>
                setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {errors.hoursPerWeek && (
              <p className="text-red-500 text-sm mt-1">{errors.hoursPerWeek}</p>
            )}
          </div>

          {/* Portfolio Link (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio/GitHub Link <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="url"
              value={formData.portfolioLink}
              onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://github.com/yourusername or https://yourportfolio.com"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

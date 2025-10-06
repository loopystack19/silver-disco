'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Bookmark, Calendar, Download, Share2, Sparkles, Target, Check, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function LearnersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'roadmap' | 'ai-tutor'>('roadmap');

  const relatedRoadmaps = [
    { name: 'Data Structures and Algorithms', checked: true },
    { name: 'System Design Roadmap', checked: true },
    { name: 'Software Design & Architecture', checked: true }
  ];

  const otherResources = [
    { name: 'Coding Interview University', checked: true }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">All Roadmaps</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Bookmark className="w-5 h-5 text-gray-600" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">
                <Calendar className="w-4 h-4" />
                Schedule Learning Time
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="py-8 border-b border-gray-200">
          <h1 className="text-6xl font-black text-gray-900 mb-3">
            Computer Science
          </h1>
          <p className="text-xl text-gray-600">
            Computer Science curriculum with free resources for a self-taught developer.
          </p>
        </div>

        {/* Tabs and Progress Section */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between py-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`flex items-center gap-2 pb-4 px-1 font-semibold border-b-2 transition ${
                  activeTab === 'roadmap'
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                Roadmap
              </button>
              <button
                onClick={() => setActiveTab('ai-tutor')}
                className={`flex items-center gap-2 pb-4 px-1 font-semibold border-b-2 transition ${
                  activeTab === 'ai-tutor'
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                AI Tutor
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition">
              <Target className="w-4 h-4" />
              Personalize
              <span className="px-2 py-0.5 bg-yellow-300 text-yellow-900 text-xs font-bold rounded ml-1">
                New
              </span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="py-4 flex items-center justify-between bg-gray-50 -mx-4 px-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-yellow-300 text-yellow-900 font-bold text-sm rounded">
                0% DONE
              </span>
              <span className="text-gray-700 text-sm font-medium">
                0 of 187 Done
              </span>
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-semibold transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
              </svg>
              Track Progress
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6 py-8">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Related Roadmaps */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                Related Roadmaps
              </h3>
              <div className="space-y-3">
                {relatedRoadmaps.map((roadmap, index) => (
                  <button
                    key={index}
                    className="flex items-start gap-3 w-full text-left hover:opacity-70 transition"
                  >
                    <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-900 font-medium leading-tight">
                      {roadmap.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Other Resources */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                Other Resources
              </h3>
              <div className="space-y-3">
                {otherResources.map((resource, index) => (
                  <button
                    key={index}
                    className="flex items-start gap-3 w-full text-left hover:opacity-70 transition"
                  >
                    <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-900 font-medium leading-tight">
                      {resource.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-gray-700 hover:bg-gray-800 text-white rounded flex items-center justify-center transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-gray-800 text-white rounded flex items-center justify-center transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-gray-800 text-white rounded flex items-center justify-center transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Roadmap Content */}
          <div className="col-span-9">
            <div className="space-y-8">
              {/* Roadmap Visualization Area */}
              <div className="border border-gray-200 rounded-lg p-12">
                {/* Dotted line connector */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  </div>
                </div>

                {/* Roadmap Title */}
                <div className="text-center mb-12">
                  <h2 className="text-5xl font-black text-gray-900 mb-8">
                    Computer Science
                  </h2>
                </div>

                {/* Right aligned CTA box */}
                <div className="flex justify-end mb-12">
                  <div className="max-w-md text-right">
                    <p className="text-gray-900 font-medium mb-1">
                      Find the detailed version of this roadmap
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      along with other similar roadmaps
                    </p>
                    <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition">
                      roadmap.sh
                    </button>
                  </div>
                </div>

                {/* Learning Path Boxes (styled like roadmap.sh) */}
                <div className="relative">
                  {/* Dotted line connector */}
                  <div className="absolute left-1/2 top-0 bottom-0 flex flex-col items-center gap-1 transform -translate-x-1/2">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    ))}
                  </div>

                  {/* Topic boxes */}
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-center">
                      <button className="px-8 py-4 bg-yellow-300 hover:bg-yellow-400 border-2 border-gray-900 text-gray-900 font-bold text-lg rounded-lg transition-all hover:scale-105 shadow-md">
                        Pick a Language
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                      {['Python', 'Go', 'C#', 'C++'].map((lang, index) => (
                        <button
                          key={index}
                          className="px-6 py-4 bg-yellow-300 hover:bg-yellow-400 border-2 border-gray-900 text-gray-900 font-bold text-lg rounded-lg transition-all hover:scale-105 shadow-md"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="text-center text-gray-600">
                <p className="text-sm">
                  This is an interactive roadmap. Click on any topic to learn more about it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

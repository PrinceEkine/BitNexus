
import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, Filter, UserPlus, AlertTriangle, CheckCircle2, MoreVertical, MapPin, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminTickets: React.FC = () => {
  const store = useStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredTickets = store.tickets.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase()) || 
                         t.description.toLowerCase().includes(search.toLowerCase()) ||
                         t.address.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const handleAssign = (ticketId: string, techId: string) => {
    store.updateTicket(ticketId, { technician_id: techId, status: 'assigned' });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Ticket Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage incoming service requests and dispatch technicians.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Dispatch All
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets, addresses, or issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', 'pending', 'assigned', 'in_progress', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === f 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No tickets found matching your criteria.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{ticket.category}</h3>
                    <span className="text-xs text-slate-400">• {new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{ticket.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {ticket.address}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +234 800 123 4567</span>
                    {ticket.live_video_enabled && (
                      <span className="flex items-center gap-1.5 text-indigo-500 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md">
                        Video Assessment Requested
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="w-full sm:w-auto">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Assign Technician</label>
                    <select
                      value={ticket.technician_id || ''}
                      onChange={(e) => handleAssign(ticket.id, e.target.value)}
                      className="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Select Tech</option>
                      {store.technicians.filter(tech => tech.status === 'available').map(tech => (
                        <option key={tech.id} value={tech.id}>{tech.name} ({tech.zone})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Details
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Footer / Status Bar */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${ticket.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-indigo-500'}`} />
                  <span className="text-xs font-medium text-slate-500 capitalize">{ticket.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:underline">
                    <MessageSquare className="w-3 h-3" /> Chat with Customer
                  </button>
                  {ticket.status === 'in_progress' && (
                    <button className="text-xs text-emerald-600 font-bold flex items-center gap-1 hover:underline">
                      <CheckCircle2 className="w-3 h-3" /> Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTickets;

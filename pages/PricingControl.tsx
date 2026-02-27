
import React, { useState } from 'react';
import { useStore } from '../store';
import { DollarSign, Percent, Zap, Save, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingControl: React.FC = () => {
  const store = useStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async (id: string, updates: any) => {
    setIsSaving(true);
    await store.updatePricingRule(id, updates);
    setIsSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Pricing Control</h1>
          <p className="text-slate-600 dark:text-slate-400">Configure service fees, emergency multipliers, and parts markups.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category Rule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {store.pricingRules.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No pricing rules configured. Default rates will apply.</p>
          </div>
        ) : (
          store.pricingRules.map((rule) => (
            <motion.div
              key={rule.id}
              layout
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="lg:w-1/4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{rule.category}</h3>
                  <p className="text-sm text-slate-500">Service Category</p>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Base Service Fee</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                      <input
                        type="number"
                        value={rule.base_fee}
                        onChange={(e) => handleUpdate(rule.id, { base_fee: Number(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Emergency Multiplier</label>
                    <div className="relative">
                      <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                      <input
                        type="number"
                        step="0.1"
                        value={rule.emergency_multiplier}
                        onChange={(e) => handleUpdate(rule.id, { emergency_multiplier: Number(e.target.value) })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">x</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Parts Markup</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                      <input
                        type="number"
                        value={rule.parts_markup_percent}
                        onChange={(e) => handleUpdate(rule.id, { parts_markup_percent: Number(e.target.value) })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-auto flex items-center gap-2">
                  <button 
                    disabled={isSaving}
                    className="p-3 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Global Settings */}
      <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-600" />
          Global Payment Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Escrow Hold</p>
                <p className="text-xs text-slate-500">Hold payment until customer confirms completion</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Automated Invoicing</p>
                <p className="text-xs text-slate-500">Generate and send PDF invoices on job completion</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600" defaultChecked />
            </label>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-400 uppercase mb-4">Payment Integrations</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Paystack</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 opacity-50">
                <span className="font-medium text-slate-700 dark:text-slate-300">Flutterwave</span>
                <button className="text-xs font-bold text-indigo-600 hover:underline">Connect</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingControl;

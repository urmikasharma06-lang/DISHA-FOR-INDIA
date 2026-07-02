import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import FileUploadZone from '../../components/volunteer/FileUploadZone';

const schema = z.object({
  motivationStatement: z.string().min(50, 'Motivation statement must be at least 50 characters').max(1000, 'Motivation statement is too long'),
  skills: z.string().min(2, 'Please list at least one skill'),
  availability: z.string().min(1, 'Please select your availability'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  emergencyContact: z.string().min(1, 'Emergency contact is required')
});

const ApplicationForm = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { submitApplication } = useVolunteer();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    // In a real app, fetch program details here
    // For mock, just delay and set a dummy title
    const fetchProgram = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 600));
      setProgram({ id: programId, title: 'Sample Program for Application', category: 'Education' });
      setLoading(false);
    };
    fetchProgram();
  }, [programId]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const formData = {
        ...data,
        documents: files.map(f => f.name)
      };
      
      await submitApplication(programId, formData);
      
      // Success - redirect to applications list
      navigate('/applications', { state: { successMessage: 'Application submitted successfully!' } });
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container" 
      style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}
    >
      <button 
        onClick={() => navigate(-1)} 
        className="btn" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: 0, backgroundColor: 'transparent', color: 'var(--color-body)' }}
      >
        <ArrowLeft size={18} /> Back to Program
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Apply for Volunteer Program</h1>
        <p style={{ color: 'var(--color-body)' }}>Complete the form below to apply for <strong style={{ color: 'var(--color-heading)' }}>{program?.title}</strong></p>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', 
          borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' 
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div className="form-group">
          <label className="form-label" htmlFor="motivationStatement">Why do you want to volunteer for this program? *</label>
          <textarea 
            id="motivationStatement"
            {...register('motivationStatement')}
            className="form-control"
            rows="5"
            placeholder="Tell us about your motivation..."
          />
          {errors.motivationStatement && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.motivationStatement.message}</span>}
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label" htmlFor="skills">Relevant Skills *</label>
            <input 
              id="skills"
              {...register('skills')}
              type="text"
              className="form-control"
              placeholder="e.g. Teaching, First Aid, Organization"
            />
            {errors.skills && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.skills.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="availability">Availability *</label>
            <select id="availability" {...register('availability')} className="form-control">
              <option value="">Select availability...</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="both">Both</option>
              <option value="flexible">Flexible</option>
            </select>
            {errors.availability && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.availability.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number *</label>
            <input 
              id="phone"
              {...register('phone')}
              type="tel"
              className="form-control"
              placeholder="+91"
            />
            {errors.phone && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emergencyContact">Emergency Contact *</label>
            <input 
              id="emergencyContact"
              {...register('emergencyContact')}
              type="text"
              className="form-control"
              placeholder="Name and Phone"
            />
            {errors.emergencyContact && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.emergencyContact.message}</span>}
          </div>
        </div>

        <div>
          <FileUploadZone 
            onFilesSelected={setFiles}
            label="Supporting Documents (Resume, ID, etc.)"
          />
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {submitting ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : <Send size={16} />}
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ApplicationForm;

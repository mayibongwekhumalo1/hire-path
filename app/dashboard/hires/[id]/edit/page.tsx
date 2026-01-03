"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { Select } from '@/components/ui/form/select';
import { DatePicker } from '@/components/ui/form/date-picker';
import { Modal } from '@/components/ui/modal';
import { mockData } from '@/lib/utils/mock-data';
import {
  Hire,
  HireFormData,
  FormErrors,
  EmploymentType,
  WorkLocation,
  SelectOption
} from '@/types/hire.types';

const employmentTypeOptions: SelectOption[] = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACTOR', label: 'Contractor' },
  { value: 'INTERN', label: 'Intern' },
];

const workLocationOptions: SelectOption[] = [
  { value: 'OFFICE', label: 'Office' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
];

const departmentOptions: SelectOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
];

export default function EditHirePage() {
  const params = useParams();
  const router = useRouter();
  const [hire, setHire] = useState<Hire | null>(null);
  const [formData, setFormData] = useState<HireFormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHire = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const hireId = params.id as string;
      const hireData = mockData.getHireById(hireId);

      if (hireData) {
        setHire(hireData);
        setFormData({
          firstName: hireData.firstName,
          lastName: hireData.lastName,
          email: hireData.email,
          personalEmail: hireData.personalEmail,
          phone: hireData.phone,
          department: hireData.department,
          jobTitle: hireData.jobTitle,
          employmentType: hireData.employmentType,
          startDate: hireData.startDate,
          workLocation: hireData.workLocation,
          managerName: hireData.managerName,
          managerEmail: hireData.managerEmail,
          notes: hireData.notes,
        });
      }

      setLoading(false);
    };

    if (params.id) {
      loadHire();
    }
  }, [params.id]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.jobTitle?.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.workLocation) newErrors.workLocation = 'Work location is required';
    if (formData.managerEmail && !/\S+@\S+\.\S+/.test(formData.managerEmail)) {
      newErrors.managerEmail = 'Manager email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: keyof HireFormData, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const hireId = params.id as string;
      const updatedHire = mockData.updateHire(hireId, {
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        personalEmail: formData.personalEmail,
        phone: formData.phone,
        department: formData.department!,
        jobTitle: formData.jobTitle!,
        employmentType: formData.employmentType as EmploymentType,
        startDate: formData.startDate!,
        workLocation: formData.workLocation as WorkLocation,
        managerName: formData.managerName,
        managerEmail: formData.managerEmail,
        notes: formData.notes,
        updatedAt: new Date(),
      });

      if (updatedHire) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error updating hire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push(`/dashboard/hires/${params.id}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!hire) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hire Not Found</h2>
        <p className="text-gray-600 mb-6">The hire you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/dashboard/hires')}>
          Back to Hires
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Hire</h1>
          <p className="text-gray-600">Update the information for {hire.firstName} {hire.lastName}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={(value) => handleFieldChange('firstName', value)}
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={(value) => handleFieldChange('lastName', value)}
                  error={errors.lastName}
                  required
                />
              </div>

              <div className="mt-6">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(value) => handleFieldChange('email', value)}
                  error={errors.email}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Input
                  label="Personal Email (Optional)"
                  name="personalEmail"
                  type="email"
                  value={formData.personalEmail || ''}
                  onChange={(value) => handleFieldChange('personalEmail', value)}
                  error={errors.personalEmail}
                />
                <Input
                  label="Phone Number (Optional)"
                  name="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(value) => handleFieldChange('phone', value)}
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Job Details */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
              <div className="space-y-6">
                <Input
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle || ''}
                  onChange={(value) => handleFieldChange('jobTitle', value)}
                  error={errors.jobTitle}
                  required
                />

                <Select
                  label="Department"
                  name="department"
                  options={departmentOptions}
                  value={formData.department || ''}
                  onChange={(value) => handleFieldChange('department', value)}
                  error={errors.department}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Employment Type"
                    name="employmentType"
                    options={employmentTypeOptions}
                    value={formData.employmentType || ''}
                    onChange={(value) => handleFieldChange('employmentType', value)}
                    error={errors.employmentType}
                    required
                  />

                  <DatePicker
                    label="Start Date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={(date) => handleFieldChange('startDate', date || new Date())}
                    error={errors.startDate}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Manager & Location */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Manager & Location</h2>
              <div className="space-y-6">
                <Input
                  label="Manager Name"
                  name="managerName"
                  value={formData.managerName || ''}
                  onChange={(value) => handleFieldChange('managerName', value)}
                  error={errors.managerName}
                />

                <Input
                  label="Manager Email"
                  name="managerEmail"
                  type="email"
                  value={formData.managerEmail || ''}
                  onChange={(value) => handleFieldChange('managerEmail', value)}
                  error={errors.managerEmail}
                />

                <Select
                  label="Work Location"
                  name="workLocation"
                  options={workLocationOptions}
                  value={formData.workLocation || ''}
                  onChange={(value) => handleFieldChange('workLocation', value)}
                  error={errors.workLocation}
                  required
                />

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes || ''}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Any additional notes about this hire..."
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
          >
            Update Hire
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Hire Updated Successfully! 🎉"
        description={`The information for ${hire.firstName} ${hire.lastName} has been updated.`}
      >
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => router.push('/dashboard/hires')}>
            View All Hires
          </Button>
          <Button onClick={handleModalClose}>
            Continue
          </Button>
        </div>
      </Modal>
    </div>
  );
}
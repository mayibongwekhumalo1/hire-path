"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { formatDate } from '@/lib/utils/string.utils';

const steps = [
  { id: 1, label: 'Basic Info', description: 'Personal details' },
  { id: 2, label: 'Job Details', description: 'Role and employment' },
  { id: 3, label: 'Manager & Location', description: 'Reporting and work setup' },
  { id: 4, label: 'Review & Submit', description: 'Confirm and create' },
];

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

function Step1BasicInfo({
  formData,
  errors,
  onChange
}: {
  formData: HireFormData;
  errors: FormErrors;
  onChange: (field: keyof HireFormData, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName || ''}
          onChange={(value) => onChange('firstName', value)}
          error={errors.firstName}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName || ''}
          onChange={(value) => onChange('lastName', value)}
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email || ''}
        onChange={(value) => onChange('email', value)}
        error={errors.email}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Personal Email (Optional)"
          name="personalEmail"
          type="email"
          value={formData.personalEmail || ''}
          onChange={(value) => onChange('personalEmail', value)}
          error={errors.personalEmail}
        />
        <Input
          label="Phone Number (Optional)"
          name="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(value) => onChange('phone', value)}
          error={errors.phone}
        />
      </div>
    </div>
  );
}

function Step2JobDetails({
  formData,
  errors,
  onChange
}: {
  formData: HireFormData;
  errors: FormErrors;
  onChange: (field: keyof HireFormData, value: string | Date) => void;
}) {
  return (
    <div className="space-y-6">
      <Input
        label="Job Title"
        name="jobTitle"
        value={formData.jobTitle || ''}
        onChange={(value) => onChange('jobTitle', value)}
        error={errors.jobTitle}
        required
      />

      <Select
        label="Department"
        name="department"
        options={departmentOptions}
        value={formData.department || ''}
        onChange={(value) => onChange('department', value)}
        error={errors.department}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Employment Type"
          name="employmentType"
          options={employmentTypeOptions}
          value={formData.employmentType || ''}
          onChange={(value) => onChange('employmentType', value)}
          error={errors.employmentType}
          required
        />

        <DatePicker
          label="Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={(date) => onChange('startDate', date || new Date())}
          error={errors.startDate}
          minDate={new Date()}
          required
        />
      </div>
    </div>
  );
}

function Step3ManagerLocation({
  formData,
  errors,
  onChange
}: {
  formData: HireFormData;
  errors: FormErrors;
  onChange: (field: keyof HireFormData, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Input
        label="Manager Name"
        name="managerName"
        value={formData.managerName || ''}
        onChange={(value) => onChange('managerName', value)}
        error={errors.managerName}
        required
      />

      <Input
        label="Manager Email"
        name="managerEmail"
        type="email"
        value={formData.managerEmail || ''}
        onChange={(value) => onChange('managerEmail', value)}
        error={errors.managerEmail}
        required
      />

      <Select
        label="Work Location"
        name="workLocation"
        options={workLocationOptions}
        value={formData.workLocation || ''}
        onChange={(value) => onChange('workLocation', value)}
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
          onChange={(e) => onChange('notes', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Any additional notes about this hire..."
        />
      </div>
    </div>
  );
}

function Step4ReviewSubmit({
  formData,
  onEdit
}: {
  formData: HireFormData;
  onEdit: (step: number) => void;
}) {
  const reviewItems = [
    {
      step: 1,
      title: 'Basic Information',
      fields: [
        { label: 'Name', value: `${formData.firstName} ${formData.lastName}` },
        { label: 'Email', value: formData.email },
        { label: 'Personal Email', value: formData.personalEmail || 'Not provided' },
        { label: 'Phone', value: formData.phone || 'Not provided' },
      ],
    },
    {
      step: 2,
      title: 'Job Details',
      fields: [
        { label: 'Job Title', value: formData.jobTitle },
        { label: 'Department', value: formData.department },
        { label: 'Employment Type', value: employmentTypeOptions.find(opt => opt.value === formData.employmentType)?.label },
        { label: 'Start Date', value: formData.startDate ? formatDate(formData.startDate) : '' },
      ],
    },
    {
      step: 3,
      title: 'Manager & Location',
      fields: [
        { label: 'Manager Name', value: formData.managerName },
        { label: 'Manager Email', value: formData.managerEmail },
        { label: 'Work Location', value: workLocationOptions.find(opt => opt.value === formData.workLocation)?.label },
        { label: 'Notes', value: formData.notes || 'No notes provided' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {reviewItems.map((item) => (
        <div key={item.step} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item.step)}
            >
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.fields.map((field, index) => (
              <div key={index}>
                <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{field.value}</dd>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewHirePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<HireFormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdHire, setCreatedHire] = useState<Hire | null>(null);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        break;

      case 2:
        if (!formData.jobTitle?.trim()) newErrors.jobTitle = 'Job title is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        break;

      case 3:
        if (!formData.managerName?.trim()) newErrors.managerName = 'Manager name is required';
        if (!formData.managerEmail?.trim()) newErrors.managerEmail = 'Manager email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.managerEmail)) newErrors.managerEmail = 'Manager email is invalid';
        if (!formData.workLocation) newErrors.workLocation = 'Work location is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
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

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const hireData = {
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
        status: 'PENDING' as const,
        managerName: formData.managerName,
        managerEmail: formData.managerEmail,
        notes: formData.notes,
      };

      const created = mockData.createHire(hireData);
      setCreatedHire(created);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating hire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // Mock save draft functionality
    localStorage.setItem('hireDraft', JSON.stringify(formData));
    alert('Draft saved successfully!');
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push('/dashboard/hires');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} errors={errors} onChange={handleFieldChange} />;
      case 2:
        return <Step2JobDetails formData={formData} errors={errors} onChange={handleFieldChange} />;
      case 3:
        return <Step3ManagerLocation formData={formData} errors={errors} onChange={handleFieldChange} />;
      case 4:
        return <Step4ReviewSubmit formData={formData} onEdit={handleEdit} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Hire</h1>
        <p className="text-gray-600">Complete the information to onboard a new team member</p>
      </div>

      {/* Stepper */}
      <Card className="p-6">
        <Stepper steps={steps} currentStep={currentStep} />
      </Card>

      {/* Form Content */}
      <Card className="p-6">
        {renderCurrentStep()}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={isSubmitting}>
              Create Hire
            </Button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Hire Created Successfully! 🎉"
        description={`New hire ${createdHire?.firstName} ${createdHire?.lastName} has been added to the system.`}
      >
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Hire successfully created
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>The onboarding process has been initiated. Check the dashboard for progress updates.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => router.push('/dashboard/hires')}>
              View All Hires
            </Button>
            <Button onClick={handleModalClose}>
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
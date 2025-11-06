import { useState } from "react";
import "./Form.css";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    interests: [] as string[],
    country: "",
    newsletter: false,
    date: "",
    comments: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const interestsOptions = ["Technology", "Sports", "Music", "Travel", "Reading"];

  const validateEmail = async (email: string): Promise<boolean> => {
    // Simulate async validation (e.g., checking if email exists)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate: "test@example.com" is taken
        resolve(email !== "test@example.com");
      }, 500);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      if (name === "newsletter") {
        setFormData({ ...formData, [name]: checked });
      } else {
        // Handle interests checkboxes
        const interest = value;
        setFormData({
          ...formData,
          interests: checked
            ? [...formData.interests, interest]
            : formData.interests.filter((i) => i !== interest),
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleEmailBlur = async () => {
    if (formData.email && !errors.email) {
      const isValid = await validateEmail(formData.email);
      if (!isValid) {
        setErrors({ ...errors, email: "This email is already taken" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 120) {
      newErrors.age = "Age must be between 18 and 120";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (formData.interests.length === 0) newErrors.interests = "Select at least one interest";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.date) newErrors.date = "Date is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="form-container" role="main">
      <h1>Complex Form</h1>
      <p className="form-subtitle">Form with various input types and async validation</p>

      <form onSubmit={handleSubmit} className="complex-form" noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <span id="name-error" className="error-message" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <span id="email-error" className="error-message" role="alert">
                {errors.email}
              </span>
            )}
            <small>Try "test@example.com" to see async validation error</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">
              Age <span className="required">*</span>
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min="18"
              max="120"
              value={formData.age}
              onChange={handleChange}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? "age-error" : undefined}
            />
            {errors.age && (
              <span id="age-error" className="error-message" role="alert">
                {errors.age}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>
              Gender <span className="required">*</span>
            </label>
            <div className="radio-group" role="radiogroup" aria-labelledby="gender-label">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                Male
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                Female
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleChange}
                />
                Other
              </label>
            </div>
            {errors.gender && (
              <span className="error-message" role="alert">
                {errors.gender}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>
            Interests <span className="required">*</span>
          </label>
          <div className="checkbox-group" role="group" aria-labelledby="interests-label">
            {interestsOptions.map((interest) => (
              <label key={interest} className="checkbox-label">
                <input
                  type="checkbox"
                  name="interests"
                  value={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={handleChange}
                />
                {interest}
              </label>
            ))}
          </div>
          {errors.interests && (
            <span className="error-message" role="alert">
              {errors.interests}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">
              Country <span className="required">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? "country-error" : undefined}
            >
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
            </select>
            {errors.country && (
              <span id="country-error" className="error-message" role="alert">
                {errors.country}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">
              Date <span className="required">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "date-error" : undefined}
            />
            {errors.date && (
              <span id="date-error" className="error-message" role="alert">
                {errors.date}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
            />
            Subscribe to newsletter
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={4}
            placeholder="Optional comments..."
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {showToast && (
        <div className="toast" role="alert" aria-live="polite">
          Form submitted successfully!
        </div>
      )}
    </div>
  );
}

export default Form;


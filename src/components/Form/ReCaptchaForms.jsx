import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export const RecaptchaForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const recaptchaRef = useRef(null);

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const handleRecaptchaExpired = () => {
        setRecaptchaToken(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = await recaptchaRef.current.executeAsync();

            if (!token) {
                alert('reCAPTCHA verification failed. Please try again.');
                setIsSubmitting(false);
                return;
            }
            // Send form data along with reCAPTCHA token to  backend
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    recaptchaToken: token
                })
            });

            if (response.ok) {
                // Handle success
                alert('Login successful!');

                // Reset form
                setFormData({ email: '', password: '' });
                setRecaptchaToken(null);
                recaptchaRef.current?.reset();
            } else {
                const errorData = await response.json();
                console.error('Form submission failed:', errorData);
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login Form</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* reCAPTCHA v2 Invisible Component */}
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="YOUR_SITE_KEY_HERE"
                    size="invisible"
                    onChange={handleRecaptchaChange}
                    onExpired={handleRecaptchaExpired}
                />

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                    <strong>reCAPTCHA v2 Invisible:</strong> The reCAPTCHA challenge will appear automatically when you submit the form.
                </p>
            </div>
        </div>
    );
}; 
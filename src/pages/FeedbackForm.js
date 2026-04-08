import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/api/forms")
      .then(res => setForms(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
    if (errors[questionId]) {
      setErrors({
        ...errors,
        [questionId]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedForm) {
      newErrors.form = "Please select a form";
      return newErrors;
    }
    selectedForm.questions.forEach(q => {
      if (!responses[q.id] || responses[q.id].trim() === "") {
        newErrors[q.id] = "This field is required";
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit feedback
    const feedbackData = {
      formId: selectedForm.id,
      responses: Object.keys(responses).map(questionId => ({
        questionId: parseInt(questionId),
        answer: responses[questionId]
      }))
    };

    axios.post("http://localhost:8080/api/feedback", feedbackData)
      .then(() => {
        setSubmitted(true);
        alert("Feedback submitted successfully!");
      })
      .catch(err => {
        console.error(err);
        alert("Error submitting feedback");
      });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
          <p>Your feedback has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Available Feedback Forms</h2>

        {forms.length === 0 ? (
          <p>No forms available</p>
        ) : (
          <>
            {!selectedForm ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Select a Form</h3>
                {forms.map(form => (
                  <div key={form.id} className="border p-4 mb-4 rounded cursor-pointer hover:bg-gray-50"
                       onClick={() => setSelectedForm(form)}>
                    <h4 className="font-medium">{form.title}</h4>
                    {form.description && <p className="text-gray-600">{form.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">{selectedForm.title}</h3>
                  {selectedForm.description && <p className="text-gray-600">{selectedForm.description}</p>}
                </div>

                {selectedForm.questions?.map((q) => (
                  <div key={q.id} className="mb-4">
                    <label className="block text-sm font-medium mb-2">{q.questionText}</label>
                    {q.type === 'TEXT' && (
                      <textarea
                        className="w-full p-2 border rounded"
                        value={responses[q.id] || ''}
                        onChange={(e) => handleResponseChange(q.id, e.target.value)}
                        rows={3}
                      />
                    )}
                    {q.type === 'RATING' && (
                      <select
                        className="w-full p-2 border rounded"
                        value={responses[q.id] || ''}
                        onChange={(e) => handleResponseChange(q.id, e.target.value)}
                      >
                        <option value="">Select rating</option>
                        {[1,2,3,4,5].map(r => (
                          <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    )}
                    {q.type === 'MCQ' && (
                      <div>
                        {q.options?.map((option, idx) => (
                          <label key={idx} className="block">
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={option}
                              checked={responses[q.id] === option}
                              onChange={(e) => handleResponseChange(q.id, e.target.value)}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}
                    {errors[q.id] && <p className="text-red-500 text-sm">{errors[q.id]}</p>}
                  </div>
                ))}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedForm(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Back to Forms
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;

import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/forms")
      .then(res => setForms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Available Feedback Forms</h2>

      {forms.length === 0 ? (
        <p>No forms available</p>
      ) : (
        forms.map(form => (
          <div key={form.id}>
            <h3>{form.title}</h3>

            {form.questions?.map((q, index) => (
              <div key={index}>
                <label>{q.questionText}</label>
                <input type="text" />
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default FeedbackForm;

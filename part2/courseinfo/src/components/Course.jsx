import React from "react";

const Course = ({ course }) => {
  const total = course.parts.reduce((sum, part) => {
    console.log("what is happening", sum, part);
    return sum + part.exercises;
  }, 0);

  return (
    <div>
      <h2>{course.name}</h2>
      {course.parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
      <p>
        <b>Total of {total} exercises</b>
      </p>
    </div>
  );
};

export default Course;

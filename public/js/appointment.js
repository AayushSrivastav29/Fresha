const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const url = "http://localhost:5000/api";
const tableBody = document.getElementById("appointmentTableBody");
let storedAppointments = [];
if (!token || !user) {
  alert("Access denied");
  window.location.href = "/login.html";
}
let currentReview = null;
loadAppointments();

async function loadAppointments() {
  try {
    let res = null;
    if (user.role === "customer") {
      res = await axios.get(`${url}/appointment/getmy/`, {
        headers: { Authorization: `${token}` },
      });
    } else if (user.role === "admin" || user.role === "staff") {
      res = await axios.get(`${url}/appointment/all`, {
        headers: { Authorization: `${token}` },
      });
    }

    const data = res.data.appointments;
    storedAppointments = res.data.appointments;
    tableBody.innerHTML = "";

    data.forEach((appt) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${appt.Service.name}</td>
        <td>${appt.Staff.User.name}</td>
        <td>${appt.date}</td>
        <td>${appt.startTime} - ${appt.endTime}</td>
        <td>${appt.status}</td>
         <td>
        ${
          appt.status === "confirmed" || appt.status === "rescheduled"
            ? `<button class="btn btn-sm btn-success" onclick="openReviewModal(${appt.id})">Review</button>`
            : ""
        }
      </td>
        <td>
        ${
          appt.status === "confirmed"
            ? `<button class="btn btn-sm btn-warning me-2" onclick="openRescheduleModal(${appt.id})">Reschedule</button>`
            : ""
        }
    <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${
      appt.id
    })">Cancel</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load appointments");
  }
}
async function fetchAvailableSlots() {
  const date = document.getElementById("newDate").value;
  const serviceId = document.getElementById("rescheduleServiceId").value;
  const staffId = document.getElementById("rescheduleStaffId").value;
  const slotSelect = document.getElementById("slotSelect");

  if (!date || !serviceId) return;

  try {
    const res = await axios.get(
      `${url}/appointment/avail-slots?serviceId=${serviceId}&date=${date}`,
      {
        headers: { Authorization: `${token}` },
      }
    );

    slotSelect.innerHTML = `<option value="">-- Select a Time Slot --</option>`;
    const staffSlot = res.data.find((s) => s.staffId === Number(staffId));
    if (staffSlot) {
      staffSlot.availableSlots.forEach((time) => {
        const opt = document.createElement("option");
        opt.value = time;
        opt.textContent = time;
        slotSelect.appendChild(opt);
      });
    } else {
      const opt = document.createElement("option");
      opt.textContent = "No available slots";
      slotSelect.appendChild(opt);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to load available slots");
  }
}

// Cancel
async function cancelAppointment(id) {
  if (!confirm("Cancel this appointment?")) return;

  try {
    await axios.delete(`${url}/appointment/cancel/${id}`, {
      headers: { Authorization: `${token}` },
    });
    alert("Cancelled");
    loadAppointments();
  } catch (err) {
    alert("Error cancelling appointment");
  }
}

// Reschedule Modal
function openRescheduleModal(id) {
  const appointment = storedAppointments.find((a) => a.id === id);
  document.getElementById("rescheduleId").value = id;
  document.getElementById("rescheduleStaffId").value = appointment.staffId;
  document.getElementById("rescheduleServiceId").value = appointment.serviceId;
  document.getElementById(
    "slotSelect"
  ).innerHTML = `<option value="">-- Select a Time Slot --</option>`;
  new bootstrap.Modal(document.getElementById("rescheduleModal")).show();
}

//review addition
async function openReviewModal(appointmentId) {
  document.getElementById("reviewFormContainer").innerHTML = "Loading...";
  const container = document.getElementById("reviewContent");
  container.innerHTML = "";
  currentReview = null;

  try {
    const reviewRes = await axios.get(`${url}/review/${appointmentId}`, {
      headers: { Authorization: `${token}` },
    });
    const review = reviewRes.data.review;
    currentReview = review;

    container.innerHTML = `
      <p><strong>Rating:</strong> ${review.rating}</p>
      <p><strong>Comment:</strong> ${review.comment}</p>
      ${
        review.staffReply
          ? `<p><strong>Reply:</strong> ${review.staffReply}</p>`
          : user.role !== "customer"
          ? `<textarea id="replyBox" placeholder="Reply..."></textarea>
             <button onclick="submitReply(${review.id})">Reply</button>`
          : ""
      }
    `;

    if (user.role === "customer") {
      document.getElementById("reviewFormContainer").innerHTML = `
        <button onclick="editReview(${review.id})">Edit</button>
        <button onclick="deleteReview(${review.id})">Delete</button>
      `;
    } else {
      document.getElementById("reviewFormContainer").innerHTML = "";
    }
  } catch (err) {
    // No review yet, allow customer to submit
    if (user.role === "customer") {
      document.getElementById("reviewFormContainer").innerHTML = `
       <form onsubmit="submitReview(event, ${appointmentId})" class="p-3">
  <div class="mb-3">
    <label for="rating" class="form-label fw-bold">Rating:</label>
    <select class="form-select" id="rating" name="rating" required>
      <option selected disabled value="">Choose rating</option>
      <option value="5">⭐⭐⭐⭐⭐ (5)</option>
      <option value="4">⭐⭐⭐⭐ (4)</option>
      <option value="3">⭐⭐⭐ (3)</option>
      <option value="2">⭐⭐ (2)</option>
      <option value="1">⭐ (1)</option>
    </select>
  </div>

  <div class="mb-3">
    <label for="comment" class="form-label fw-bold">Your Feedback:</label>
    <textarea class="form-control" id="comment" name="comment" rows="3" required placeholder="Share your experience..."></textarea>
  </div>

  <button type="submit" class="btn btn-success w-100">Submit Review</button>
</form>
      `;
    }
  }

  new bootstrap.Modal(document.getElementById("reviewModal")).show();
}

async function submitReview(e, appointmentId) {
  e.preventDefault();
  const rating = e.target.rating.value;
  const comment = e.target.comment.value;
  await axios.post(
    `${url}/review/`,
    { appointmentId, rating, comment },
    {
      headers: { Authorization: `${token}` },
    }
  );
  alert("Review submitted");
  loadAppointments();
  bootstrap.Modal.getInstance(document.getElementById("reviewModal")).hide();
}

async function submitReply(reviewId) {
  const reply = document.getElementById("replyBox").value;
  await axios.put(
    `/api/review/reply/${reviewId}`,
    { reply },
    {
      headers: { Authorization: `${token}` },
    }
  );
  alert("Reply sent");
  openReviewModal(currentReview.appointmentId);
  bootstrap.Modal.getInstance(document.getElementById("reviewModal")).hide();
}

async function editReview(reviewId) {
  const newComment = prompt("Update your comment:", currentReview.comment);
  const newRating = prompt("Update rating:", currentReview.rating);
  await axios.put(
    `/api/review/${reviewId}`,
    { comment: newComment, rating: newRating },
    {
      headers: { Authorization: `${token}` },
    }
  );
  alert("Review updated");
  openReviewModal(currentReview.appointmentId);

  bootstrap.Modal.getInstance(document.getElementById("reviewModal")).hide();
}

async function deleteReview(reviewId) {
  if (!confirm("Delete review?")) return;
  await axios.delete(`/api/review/delete/${reviewId}`, {
    headers: { Authorization: `${token}` },
  });
  alert("Review deleted");
  bootstrap.Modal.getInstance(document.getElementById("reviewModal")).hide();
  loadAppointments();
}

// loadAppointments();
// Reschedule Submit
document
  .getElementById("rescheduleForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("rescheduleId").value;
    const date = document.getElementById("newDate").value;
    const startTime = document.getElementById("slotSelect").value;
    if (!startTime) {
      alert("Please select a valid time slot");
      return;
    }

    try {
      await axios.put(
        `${url}/appointment/reschedule/${id}`,
        { date, startTime },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert("Rescheduled successfully!");
      bootstrap.Modal.getInstance(
        document.getElementById("rescheduleModal")
      ).hide();
      loadAppointments();
    } catch (err) {
      alert("Only confirmed appointments can be rescheduled");
    }
  });

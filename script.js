
let clickCount = 0;
const maxClicks = 5;

document.getElementById("shareBtn").addEventListener("click", () => {
  clickCount++;
  if (clickCount <= maxClicks) {
    const msg = encodeURIComponent("Hey buddy, join Tech for Girls Community!");
    const link = `https://wa.me/?text=${msg}`;
    window.open(link, "_blank");

    document.getElementById("shareCounter").innerText = `Click count: ${clickCount}/5`;

    if (clickCount === maxClicks) {
      alert("Sharing complete. Please continue.");
    }
  }
});

document.getElementById("registrationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  if (clickCount < maxClicks) {
    alert("Please complete sharing on WhatsApp 5 times before submitting.");
    return;
  }

  if (localStorage.getItem("submitted") === "true") {
    alert("You have already submitted this form.");
    return;
  }

  const form = e.target;
  const formData = new URLSearchParams();
  formData.append("Name", form.Name.value);
  formData.append("Phone", form.Phone.value);
  formData.append("Email", form.Email.value);
  formData.append("College", form.College.value);

  const fileInput = document.getElementById("Screenshot");
  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onloadend = function () {
    const base64 = reader.result.split(",")[1];
    formData.append("Screenshot", base64);

    fetch("https://script.google.com/macros/s/AKfycbzG24KTdBOqrDjFCuSHat1pwLWd9IF-px-KJ069RdA/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((res) => res.text())
      .then((result) => {
        console.log("Server Response:", result);
        if (result.toLowerCase().includes("success")) {
          localStorage.setItem("submitted", "true");
          form.style.display = "none";
          document.getElementById("successMsg").style.display = "block";
        } else {
          alert("Server error: " + result);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Submission failed. Try again.");
      });
  };

  reader.readAsDataURL(file);
});

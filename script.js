document.addEventListener("DOMContentLoaded", () => {
    const serviceButtons = document.querySelectorAll(".service");
    let currentDate = new Date();

    function renderCalendar(button, date) {
        const courseName = button.textContent;

        let description = document.querySelector(".description");
        if (!description) {
            description = document.createElement("div");
            description.classList.add("description");
            button.after(description);
        }
        description.textContent = "Esta es una descripción genérica que ocupa cuatro líneas de texto. Por ahora sirve como ejemplo. Puedes personalizar este contenido según sea necesario para cada servicio.";

        let calendarContainer = document.querySelector(".calendar-container");
        if (!calendarContainer) {
            calendarContainer = document.createElement("div");
            calendarContainer.classList.add("calendar-container");
            description.after(calendarContainer);
        }
        calendarContainer.innerHTML = `<div id="calendar-header">
            <button id="prev-month">◀</button>
            <span id="month-label">${date.toLocaleString("es-ES", {
                month: "long",
                year: "numeric",
            })}</span>
            <button id="next-month">▶</button>
        </div>
        <div id="calendar-grid"></div>`;

        const calendarGrid = document.querySelector("#calendar-grid");
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            calendarGrid.appendChild(document.createElement("div"));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;
            dayCell.addEventListener("click", () => {
                document.querySelectorAll("#calendar-grid div").forEach((cell) => cell.classList.remove("selected"));
                dayCell.classList.add("selected");
                renderHours(calendarContainer, courseName);
            });
            calendarGrid.appendChild(dayCell);
        }
    }

    function renderHours(calendarContainer, courseName) {
        let timeOptions = document.querySelector(".time-options");
        if (!timeOptions) {
            timeOptions = document.createElement("div");
            timeOptions.classList.add("time-options");
            calendarContainer.after(timeOptions);
        }
        timeOptions.innerHTML = "";
        const times = ["11:00", "15:00", "18:30"];
        times.forEach((time) => {
            const button = document.createElement("button");
            button.textContent = time;
            button.addEventListener("click", () => {
                document.querySelectorAll(".time-options button").forEach((btn) => {
                    btn.classList.remove("selected");
                });
                button.classList.add("selected");
                renderUploadSection(timeOptions, time, courseName);
            });
            timeOptions.appendChild(button);
        });
    }

    function renderUploadSection(timeOptions, selectedHour, courseName) {
        let uploadContainer = document.querySelector(".upload-container");
        if (!uploadContainer) {
            // Botón de PayPal
            const paypalButton = document.createElement("button");
            paypalButton.classList.add("paypal-button");
            paypalButton.textContent = "Pagar por PayPal";
            timeOptions.after(paypalButton);

            // Texto "o"
            const orText = document.createElement("p");
            orText.classList.add("or-text");
            orText.textContent = "o";
            paypalButton.after(orText);

            // Botón de cargar comprobante
            const uploadButton = document.createElement("button");
            uploadButton.classList.add("upload-button");
            uploadButton.textContent = "Cargar Comprobante";
            orText.after(uploadButton);

            // Área de Drag & Drop
            uploadContainer = document.createElement("div");
            uploadContainer.classList.add("upload-container");
            uploadContainer.textContent = "Arrastra y suelta tu archivo aquí o haz clic para seleccionar.";
            uploadButton.after(uploadContainer);

            const uploadedFile = document.createElement("div");
            uploadedFile.classList.add("uploaded-file");

            uploadContainer.addEventListener("dragover", (e) => {
                e.preventDefault();
                uploadContainer.classList.add("dragover");
            });

            uploadContainer.addEventListener("dragleave", () => {
                uploadContainer.classList.remove("dragover");
            });

            uploadContainer.addEventListener("drop", (e) => {
                e.preventDefault();
                uploadContainer.classList.remove("dragover");
                const file = e.dataTransfer.files[0];
                handleFileUpload(file, uploadedFile, uploadContainer, selectedHour, courseName);
            });

            uploadButton.addEventListener("click", () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*,application/pdf";
                input.addEventListener("change", (e) => {
                    const file = e.target.files[0];
                    handleFileUpload(file, uploadedFile, uploadContainer, selectedHour, courseName);
                });
                input.click();
            });

            uploadContainer.appendChild(uploadedFile);
        }
    }

    function handleFileUpload(file, uploadedFile, uploadContainer, selectedHour, courseName) {
        if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
            uploadedFile.textContent = `Archivo seleccionado: ${file.name}`;
            uploadContainer.textContent = file.name;
            renderWhatsAppLink(uploadContainer, selectedHour, courseName);
        } else {
            uploadedFile.textContent = "Formato no soportado. Solo se permiten imágenes y PDF.";
        }
    }

    function renderWhatsAppLink(uploadContainer, selectedHour, courseName) {
        let whatsappContainer = document.querySelector(".whatsapp-container");
        if (!whatsappContainer) {
            whatsappContainer = document.createElement("div");
            whatsappContainer.classList.add("whatsapp-container");
            whatsappContainer.innerHTML = `
                <p>Si tienes una duda o consulta, nos puedes escribir al WhatsApp:</p>
                <a href="https://wa.me/51912430891?text=Hola,%20me%20he%20inscrito%20al%20curso%20${encodeURIComponent(courseName)}%20y%20tengo%20la%20siguiente%20duda%20XXXXX%20(Hora:%20${selectedHour})" target="_blank">
                    <img src="whatsapp-icon.png" alt="WhatsApp" class="whatsapp-icon">
                </a>`;
            uploadContainer.after(whatsappContainer);
        }
    }

    serviceButtons.forEach((button) => {
        button.addEventListener("click", () => {
            renderCalendar(button, currentDate);
        });
    });
});

/**
 * CV Download Functionality
 * Handles PDF generation and download for CV content
 */

document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("downloadCV");

  if (!downloadBtn) {
    console.warn("Download CV button not found");
    return;
  }

  downloadBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Hiển thị loading
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML =
      '<i class="bi bi-hourglass-split"></i> Đang tạo PDF...';
    downloadBtn.style.pointerEvents = "none";

    // Fetch nội dung resume.html trực tiếp mà không mở trang
    fetch("resume.html")
      .then((response) => response.text())
      .then((html) => {
        // Tạo DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Lấy chỉ phần container chứa CV content (bỏ section title)
        const cvContent = doc.querySelector(
          '#resume .container[data-aos="fade-up"][data-aos-delay="100"]'
        );

        if (!cvContent) {
          throw new Error("Không tìm thấy nội dung CV");
        }

        // Tạo container PDF với nền trắng
        const pdfContainer = document.createElement("div");
        pdfContainer.style.cssText = `
          width: 210mm;
          min-height: 297mm;
          padding: 15mm;
          margin: 0 auto;
          background: white !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          box-sizing: border-box;
        `;

        // Tạo CSS cho PDF - chỉ styling content, không có background
        const pdfStyle = document.createElement("style");
        pdfStyle.textContent = `
          * { 
            box-sizing: border-box; 
            background: white !important;
          }
          
          body, html, .resume, .section {
            background: white !important;
          }
          
          .resume-title { 
            font-size: 20px !important; 
            color: #149ddd !important; 
            margin-bottom: 15px !important;
            border-bottom: 2px solid #149ddd !important;
            padding-bottom: 8px !important;
            font-weight: 600 !important;
          }
          
          .education-item h4 { 
            font-size: 16px !important; 
            color: #2c3e50 !important; 
            margin-bottom: 5px !important;
            font-weight: 600 !important;
          }
          
          .education-item h5 { 
            font-size: 12px !important; 
            color: #149ddd !important; 
            margin-bottom: 5px !important;
            font-weight: 500 !important;
          }
          
          .education-item p { 
            margin-bottom: 3px !important; 
            font-size: 11px !important;
            line-height: 1.3 !important;
          }
          
          .institution { 
            font-style: italic !important;
            color: #666 !important;
          }
          
          .skill-item h4 { 
            font-size: 14px !important; 
            margin-bottom: 8px !important;
            color: #2c3e50 !important;
          }
          
          .progress { 
            height: 6px !important; 
            background: #e9ecef !important; 
            border-radius: 3px !important; 
            margin-bottom: 12px !important;
            overflow: hidden !important;
          }
          
          .progress-bar { 
            background: #149ddd !important; 
            border-radius: 3px !important;
            height: 100% !important;
          }
          
          .profile-img-container img { 
            width: 120px !important; 
            height: 120px !important; 
            border-radius: 50% !important;
            object-fit: cover !important;
            display: block !important;
            margin: 0 auto 15px auto !important;
          }
          
          .profile-img-container h3 { 
            text-align: center !important;
            font-size: 18px !important;
            color: #2c3e50 !important;
            margin-bottom: 5px !important;
            font-weight: 600 !important;
          }
          
          .profile-img-container p { 
            text-align: center !important;
            font-size: 14px !important;
            color: #149ddd !important;
            font-weight: 500 !important;
          }
          
          .row { 
            display: flex !important; 
            flex-wrap: wrap !important;
            margin: 0 -10px !important;
          }
          
          .col-lg-6 { 
            flex: 0 0 50% !important; 
            max-width: 50% !important; 
            padding: 0 10px !important;
          }
          
          .resume-item { 
            margin-bottom: 20px !important;
          }
          
          .bi { display: none !important; }
          
          a { 
            color: #149ddd !important; 
            text-decoration: none !important;
          }
          
          /* Ẩn tất cả background */
          .section, .resume-section, #resume {
            background: white !important;
          }
        `;

        // Clone nội dung CV thuần (không có section title)
        const clonedContent = cvContent.cloneNode(true);
        pdfContainer.appendChild(pdfStyle);
        pdfContainer.appendChild(clonedContent);

        // Cấu hình PDF
        const options = {
          margin: [10, 10, 10, 10],
          filename: "NguyenTienDung_CV.pdf",
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            letterRendering: true,
            width: 794,
            height: 1123,
            scrollX: 0,
            scrollY: 0,
            backgroundColor: "#ffffff",
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true,
          },
        };

        // Tạo PDF
        html2pdf()
          .set(options)
          .from(pdfContainer)
          .save()
          .then(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.style.pointerEvents = "auto";
          })
          .catch((error) => {
            console.error("Lỗi khi tạo PDF:", error);
            alert("Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại!");
            downloadBtn.innerHTML = originalText;
            downloadBtn.style.pointerEvents = "auto";
          });
      })
      .catch((error) => {
        console.error("Lỗi khi tải CV:", error);
        alert("Không thể tải nội dung CV. Vui lòng thử lại!");
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.pointerEvents = "auto";
      });
  });
});

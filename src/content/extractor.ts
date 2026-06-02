export function extractJobDescription(): string | null {
  const jobSec = document.querySelector(".job-detail-section .job-sec-text");
  if (jobSec && jobSec.textContent) {
    return jobSec.textContent.trim();
  }
  return null;
}

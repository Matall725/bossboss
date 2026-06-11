export function extractJobDescription(): string | null {
  try {
    // 提取职位描述 (主要信息)
    const jobSec = document.querySelector(".job-detail-section .job-sec-text");
    let description = "";
    if (jobSec && jobSec.textContent) {
      description = jobSec.textContent.trim();
    }

    // 提取职位名称和薪资 (作为附加信息增强上下文)
    const jobName = document.querySelector(".name .title") || document.querySelector(".name");
    const jobSalary = document.querySelector(".name .salary");

    let extraInfo = "";
    if (jobName && jobName.textContent) {
      extraInfo += `职位名称: ${jobName.textContent.trim()}\n`;
    }
    if (jobSalary && jobSalary.textContent) {
      extraInfo += `薪资: ${jobSalary.textContent.trim()}\n`;
    }

    if (!description && !extraInfo) {
      return null;
    }

    return `${extraInfo}\n职位描述:\n${description}`.trim();
  } catch (error) {
    console.error("BOSS Agent: Error extracting job description", error);
    return null;
  }
}

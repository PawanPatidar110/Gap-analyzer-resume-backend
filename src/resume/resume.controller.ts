import { Controller, Post, Body, Get, Param, UploadedFile, UseInterceptors, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResumeService } from "./resume.service";
import * as mammoth from "mammoth";
const pdf = require("pdf-parse");

@Controller("resume")
export class ResumeController {

  constructor(private readonly resumeService: ResumeService) {}

  @Post("analyze")
@UseInterceptors(FileInterceptor("resume"))
async analyze(
  @Body() body: { resumeText?: string; role: string },
  @UploadedFile() file?: Express.Multer.File
) {

  const { role } = body;

  if (!role) {
    throw new BadRequestException("role is required");
  }

  let resumeText = body.resumeText;

  // If resume file is uploaded, extract text
  if (file) {

  const fileType = file.mimetype;

  if (fileType === "application/pdf") {
    const data = await pdf(file.buffer);
    resumeText = data.text;
  }

  else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    resumeText = result.value;
  }

  else {
    throw new BadRequestException(
      "Unsupported file type. Upload PDF or DOCX"
    );
  }
}

  // Validate resume text
  if (!resumeText) {
    throw new BadRequestException("resumeText or resume file is required");
  }

  // Clean extracted text
  resumeText = resumeText.replace(/\s+/g, " ").trim();

  const result = this.resumeService.analyzeResume(resumeText, role);

  return {
    message: "Resume analysis completed",
    data: result
  };
}
@Get("role/:roleName")
getRoleDetails(@Param("roleName") roleName:string){

  const role = this.resumeService.getRoleDetails(roleName);
  if (!role) {
    throw new BadRequestException("role is required");
  }
  return {
    role
  }
}

@Get("roles")
getAllRoles() {
 
   return   this.resumeService.getAllRoles();


}
}
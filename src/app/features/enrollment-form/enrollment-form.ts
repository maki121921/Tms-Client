import { Component, inject, signal } from "@angular/core";
import {
FormBuilder,
FormControl,
Validators,
ReactiveFormsModule,
FormArray,
} from "@angular/forms";
@Component({
selector: "app-enrollment-form",
standalone: true,
imports: [ReactiveFormsModule], 
templateUrl: "./enrollment-form.html",
})
export class EnrollmentForm {

// The "private" keyword means only this class can access it.
private fb = inject(FormBuilder);

submitted = signal(false);

form = this.fb.nonNullable.group({
studentId: [
"",
[Validators.required, Validators.pattern("^STU-[0-9]{4}$")],
],
courseId: ["", Validators.required],
term: ["Fall 2026", Validators.required], 
notes: [""], // No validators this field is optional
backupCourses: this.fb.array<FormControl<string>>([]), 
});


get backups() {
return this.form.controls.backupCourses;
}
// Adds a new empty text input to the backup courses array
addBackup() {
this.backups.push(
this.fb.control("", {
nonNullable: true,
validators: Validators.required,
}),
);
}
// Removes a specific backup course row by its position in the array
removeBackup(index: number) {
this.backups.removeAt(index);
}
submit() {
if (this.form.valid) {

const payload = this.form.getRawValue();
console.log("Enrollment payload:", payload);
  this.submitted.set(true);
} else {

    this.form.markAllAsTouched();
}
}
}
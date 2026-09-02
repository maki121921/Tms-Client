import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "tms-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = "";
  password = "";
  errorMessage = "";
  isSubmitting = false;

  async signIn(): Promise<void> {
    this.errorMessage = "";
    this.isSubmitting = true;

    try {
      await this.auth.login({
        email: this.email,
        password: this.password,
      });

      await this.router.navigate(["/instructor-dashboard"]);
    } catch {
      this.errorMessage = "Invalid email or password.";
    } finally {
      this.isSubmitting = false;
    }
  }
}
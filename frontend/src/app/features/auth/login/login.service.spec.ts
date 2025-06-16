import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

class AuthServiceMock {
  login() {
    return of({ token: 'fake-jwt-token' });
  }
}

class ToastrServiceMock {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthServiceMock;
  let toastr: ToastrServiceMock;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: ToastrService, useClass: ToastrServiceMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;
    toastr = TestBed.inject(ToastrService) as any;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark fields as touched if the form is invalid', () => {
    component.onSubmit();

    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    expect(emailControl?.touched).toBeTrue();
    expect(passwordControl?.touched).toBeTrue();
    expect(toastr.error).toHaveBeenCalled();
  });

  it('should submit the form successfully and navigate if the credentials are valid', () => {
    component.loginForm.setValue({
      email: 'ba.fotero@gmail.com',
      password: 'Abc123',
    });

    component.onSubmit();

    expect(toastr.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/books']);
  });

  it('should display error if login fails', () => {
    spyOn(authService, 'login').and.returnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.loginForm.setValue({
      email: 'ba.211212fotero@gmail.com',
      password: 'Abc123',
    });

    component.onSubmit();

    expect(toastr.error).toHaveBeenCalledWith(
      'Error al iniciar sesión. Verifique sus credenciales.',
      'Error'
    );
  });
});

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ContextService } from 'src/app/core/context/context.service'
import { FilterService } from 'src/app/core/filter/filter.service';
import { PropertyService } from 'src/app/core/property/property.service';
import { FilterComponent } from './filter/filter.component';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  selectionControl: FormControl;
  destinations: Set<string>;
  countrySubscription: Subscription;
  propertySubscription: Subscription;
  isCollapsed = true;

  constructor(
    private authService: AuthService,
    private contextService: ContextService,
    private router: Router,
    private modalService: NgbModal,
    private filterService: FilterService,
    private propertyService: PropertyService
  ) { }


  ngOnInit(): void {
    this.authService.startupToken();
    const destination = this.filterService.city.length ? `${this.filterService.city}, ${this.filterService.country}` : '';
    this.selectionControl = new FormControl(destination, [ this.destinationValidator() ]);
    this.propertyService.getProperties();
    this.countrySubscription = this.propertyService.getDestinations().subscribe((destinations: Set<string>) => {
      this.destinations = destinations;
    });
  }

  destinationValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value || (control.value && this.destinations.has(control.value))) {
        return null;
      }
      return { invalidDestination: true };
    }
  }

  ngOnDestroy(): void {
    this.propertySubscription.unsubscribe();
    this.countrySubscription.unsubscribe();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  logout(): void {
    this.authService.logout();
  }

  get changeContextText(): string {
    return this.contextService.isRenter ? 'Switch to Owner View' : 'Switch to Renter View';
  }

  get isOwner(): boolean {
    return !this.contextService.isRenter;
  }

  changeContext(): void {
    this.contextService.changeContext();
    const url = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([url]));
  }

  setActiveClass(path: string): string {
    return (path === '/properties' && this.router.url === '/') || this.router.url.includes(path) ? 'nav-link btn-scale btn-outline-none active' : 'nav-link btn-scale btn-outline-none';
  }

  openLoginModal() {
    this.modalService.open(LoginComponent);
  }

  openFilterModal() {
    const modalRef = this.modalService.open(FilterComponent);
    modalRef.result.then((result) => {
      if (result === 'clear') {
        this.selectionControl.setValue('');
      }
      this.propertyService.getProperties();
    });
  }

  applyFilter() {
    if (!!this.selectionControl.value && !!this.selectionControl.valid) {
      const destination = this.selectionControl.value;
      const [city, country] = destination.split(', ');
      this.filterService.city = city;
      this.filterService.country = country;
      this.propertyService.getProperties();
      this.router.navigate(['/properties']);
    }
  }
}

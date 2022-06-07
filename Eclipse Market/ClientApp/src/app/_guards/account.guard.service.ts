import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserService } from "../_services/user.service";

@Injectable({
    providedIn: 'root'
})
export class AccountGuardService implements CanActivate {

    constructor(private router:Router, 
                private userService: UserService,
                private route: ActivatedRoute,
                private jwtHelper: JwtHelperService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const id = +localStorage.getItem('userId')!;
        const token = localStorage.getItem('token');

        if (token && !this.jwtHelper.isTokenExpired(token)){
            this.router.navigate(['/account/', id], {relativeTo: null});
            return false;
        }
        this.router.navigate(['/auth'], {relativeTo: null});
        return true;
    }
}
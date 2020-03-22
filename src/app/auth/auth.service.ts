import { Subject} from 'rxjs'
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material';
import { UISerice } from '../shared/ui.service';
import { flatMap } from 'rxjs/operators';


@Injectable()
export class AuthService{
    authChange = new Subject<boolean>();
    private user: User;
    private isAuthenticated = false ;

    constructor(private router:Router, private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private matsnackbar:MatSnackBar,
        private uiSerice:UISerice){}

   initAuthListener(){
    this.afAuth.authState.subscribe(user => {
    if(user){
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training'])
    }else{
        
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = true;
    }
    });
    }


    registerUser(authData: AuthData){
        this.uiSerice.loadingStateChanged.next(true);
        this.afAuth.auth
        .createUserWithEmailAndPassword(
            authData.email,authData.password)
            .then(result=> {
                console.log(result);
                this.uiSerice.loadingStateChanged.next(false);
            })
            .catch(error =>{
                this.uiSerice.loadingStateChanged.next(false);
                this.uiSerice.showSnackbar(error.message,null,3000)
               
            })
       
    }

    login(authData: AuthData){
        this.uiSerice.loadingStateChanged.next(true);
        this.afAuth.auth.signInWithEmailAndPassword(authData.email,authData.password)
        .then(result=> {
            this.uiSerice.loadingStateChanged.next(false);
        })
        .catch(error =>{
            this.uiSerice.loadingStateChanged.next(false);
            this.uiSerice.showSnackbar(error.message,null,3000);
        })
    }

    logout(){
        this.afAuth.auth.signOut();
    }

   
    isAuth(){
        return this.isAuthenticated;
    }

    
}
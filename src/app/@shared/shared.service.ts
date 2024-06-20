import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SharedService {
    
    public userData = new BehaviorSubject<any>(null);
    public isChecked = true;
    constructor() { }
    
}
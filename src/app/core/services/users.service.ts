import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly api: ApiService) {}

  create(user: any): Observable<any> {
    return this.api.createUser(user);
  }

  update(id: number, user: any): Observable<any> {
    return this.api.updateUser(id, user);
  }

  delete(id: number): Observable<any> {
    return this.api.deleteUser(id);
  }
}
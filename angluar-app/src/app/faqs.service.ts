import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class FaqsService {

  faqs = this.socket.fromEvent('faqs');
  constructor(private socket: Socket) { }


}

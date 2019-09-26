import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FaqsService } from './faqs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
 
  private _faqsSub: Subscription;
  title = 'angluar-app';
  faqsList: any;
  dateTimeStamp = null;
  constructor(private faqsService: FaqsService) { } 
  
  ngOnInit(): void {
    this._faqsSub = this.faqsService.faqs.subscribe((faqs: any) => {
      this.faqsList = faqs.data.faqs;
      this.dateTimeStamp = faqs.data.date;
      console.log("###### ", this.faqsList);
    })
  }

  ngOnDestroy() {
    this._faqsSub.unsubscribe();
  }


}

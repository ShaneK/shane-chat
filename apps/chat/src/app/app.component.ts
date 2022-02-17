import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SseService } from './shared';

@Component({
  selector: 'shane-chat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  hello$ = this.http.get<{ message: string }>('/api/hello');

  constructor(private http: HttpClient, private _sseService: SseService) {}

  public ngOnInit(): void {
    // console.log('Hello world! 2 2');
    // this._sseService
    //   .getServerSentEvent('/api/sse')
    //   .subscribe(event => console.log(event));
  }
}

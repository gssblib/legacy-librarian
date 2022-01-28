import { TestBed, waitForAsync } from '@angular/core/testing';
import { RpcService } from './rpc.service';
import { XHRBackend } from '@angular/http';
import { ConfigService } from './config.service';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpClientModule } from "@angular/common/http";

describe('RpcService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        RpcService,
        ConfigService,
        {provide: XHRBackend, useClass: MockBackend},
      ],
    });
  });

  describe('httpGet', () => {
    it('should return an observable with a json result', waitForAsync(() => {
      const rpcService = TestBed.get(RpcService);

      // Mock a successful JSON HTTP response.
      const http = TestBed.get(HttpClient);
      spyOn(http, 'get').and.returnValue(Observable.of({
        json() {
          return {name: 'Homer'};
        },
      }))

      /*
      The typical way to mock the HTTP service is to use the XHR mock backend, but
      this causes the result to be a promise instead of the value. This might be a bug, see

      http://stackoverflow.com/questions/43482113/angular-4-test-with-mockbackend-returns-promise

      const mockBackend = TestBed.get(XHRBackend);
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: {name: 'Homer'},
        })));
      });
      */

      rpcService.httpGet('foo').subscribe(result => {
        expect(result).toEqual({name: 'Homer'});
      });
    }));
  });
});


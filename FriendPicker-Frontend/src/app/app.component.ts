import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Friend Picker';
  private isLogged: boolean = false;
  profile?:MicrosoftGraph.User;
  userNameFilter:String="";
  users?:MicrosoftGraph.User[];

  constructor(private authService: MsalService, private client: HttpClient) {}
  ngOnInit(): void {
    this.checkAccount();
    this.getProfile();
  }

  private checkAccount() {
    this.isLogged = this.authService.instance.getAllAccounts().length > 0;
  }

  login() {
    this.authService.loginPopup().subscribe((response) => {
      this.authService.instance.setActiveAccount(response.account);
      this.checkAccount();
    });
  }

  logout(){
    this.authService.logout();
  }

  public get loggedState(): boolean {
    return this.isLogged;
  }

  getProfile(){
    this.client.get("https://graph.microsoft.com/v1.0/me/").subscribe(response=>this.profile=response);
  }

  getUsers() {
    let params = new HttpParams().set("$top", "10");
    if (this.userNameFilter) {
      params = params.set(
        "$filter",
        `startsWith(displayName, '${this.userNameFilter}')`
      );
    }
    let url = `https://graph.microsoft.com/v1.0/users?${params.toString()}`;
    this.client
      .get<any>(url)
      .subscribe((users) => (this.users = users.value));
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { environment } from 'src/environments/environment';

interface IODataResult<T> {
  value: T;
}

class AddFriendModel {
  constructor(private friendId: string) {}
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls:['app.component.css'],
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'Friend Picker';
  private isLogged: boolean = false;
  profile?: MicrosoftGraph.User;
  userNameFilter: String = '';
  users?: MicrosoftGraph.User[];
  friends: Array<MicrosoftGraph.User> = new Array<MicrosoftGraph.User>();
  friendIds!: any;

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

  logout() {
    this.authService.logout();
  }

  public get loggedState(): boolean {
    return this.isLogged;
  }

  async getProfile() {
    await this.client
      .get('https://graph.microsoft.com/v1.0/me/')
      .subscribe((response) => (this.profile = response));
  }

  getUsers() {
    let params = new HttpParams().set('$top', '10');
    if (this.userNameFilter) {
      params = params.set(
        '$filter',
        `startsWith(displayName, '${this.userNameFilter}')`
      );
    }
    let url = `https://graph.microsoft.com/v1.0/users?${params.toString()}`;
    this.client.get<any>(url).subscribe((users) => (this.users = users.value));
  }

  async updateUsers(searchFilter: string) {
    let params = new HttpParams().set('$top', '10');
    if (this.userNameFilter) {
      params = params.set(
        '$filter',
        `startsWith(displayName, '${searchFilter}')`
      );
    }
    let url = `https://graph.microsoft.com/v1.0/users?${params.toString()}`;
    this.users = (
      await this.client
        .get<IODataResult<MicrosoftGraph.User[]>>(url)
        .toPromise()
    ).value;
  }

  private async lookupUser(userId: string): Promise<MicrosoftGraph.User> {
    let url = `https://graph.microsoft.com/v1.0/users/${userId}`;
    return await this.client.get<MicrosoftGraph.User>(url).toPromise();
  }

  async updateFriends() {
    this.friendIds = await this.client
      .get<string[]>(environment.customApi + '/getAll')
      .toPromise();

      if (this.friends != null) this.friends.length = 0;

    for (const friendId of this.friendIds) {
      if (friendId != null) {
        let userData = await this.lookupUser(friendId);
        this.friends.push(userData);
      }
    }
  }

  async addFriend(user: MicrosoftGraph.User) {
    var model = new AddFriendModel(user!.id!.toString());
    this.friendIds = await this.client
      .post<AddFriendModel>(environment.customApi + '/add', model)
      .toPromise();
    this.userNameFilter = '';
    await this.updateFriends();
  }

  async removeFriend(user: MicrosoftGraph.User) {
    var model = new AddFriendModel(user!.id!.toString());
    this.friendIds = await this.client
      .post<AddFriendModel>(environment.customApi + '/remove', model)
      .toPromise();

    const index = this.friends.indexOf(user);
    if (index !== -1) {
      this.friends.splice(index, 1);
    }
  }

  public isFriend(user: MicrosoftGraph.User): boolean {
    return this.friendIds != null && this.friendIds.indexOf(user!.id) != -1;
  }
}
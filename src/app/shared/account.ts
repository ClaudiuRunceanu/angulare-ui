export class Account {
  firstName: string;
  lastName: string;
  login: string;
  email: string;


  constructor(integrationResponse: any){
    this.firstName=integrationResponse.firstName;
    this.lastName=integrationResponse.lastName;
    this.login=integrationResponse.login;
    this.email=integrationResponse.email;
  }

}

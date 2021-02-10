export class ApiComUtils {
  public static getUrl(): string {
    return "http://localhost:3000"; // window.location.origin;
  }
  
}

export function validStatus(code : number) : boolean {
  return code == 200 || code == 304;
}

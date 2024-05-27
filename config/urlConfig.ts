import { publicDecrypt } from "crypto";
import { create } from "domain";
// import { DOMAIN_URL } from "@env";

const domain = "http://192.168.1.33:8000";

const UrlConfig: any = {
  user: {
    login: `${domain}/api/v1/users/login`,
  },
  event: {
      getMyEvents: `${domain}/api/v1/events/my-events`,
    attendeeList: (eventId: string) => `${domain}/api/v1/events/${eventId}/attendees`,
  },
  order: {
    checkIn: (id : string) => `${domain}/api/v1/registrations/${id}/check-in`,
  }
};

export default UrlConfig;

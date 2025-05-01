/**
 * Represents the details of an event to be added to Google Calendar.
 */
export interface GoogleCalendarEvent {
  /**
   * The title of the event.
   */
  title: string;
  /**
   * The start date and time of the event in ISO format.
   */
  start: string;
  /**
   * The end date and time of the event in ISO format.
   */
  end: string;
  /**
   * The location of the event.
   */
  location: string;
  /**
   * A description of the event.
   */
  description: string;
}

/**
 * Asynchronously adds an event to Google Calendar.
 *
 * @param event The GoogleCalendarEvent object containing the event details.
 * @returns A promise that resolves to true if the event was added successfully, false otherwise.
 */
export async function addEventToCalendar(event: GoogleCalendarEvent): Promise<boolean> {
  // TODO: Implement this by calling an API.

  console.log("Adding event to Google Calendar:", event);
  return true;
}

class dzBookingPopup extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-booking-popup';
  }


  

  render() {
    return this.html`
        <h1>房A</h1>
        <vaadin-dialog></vaadin-dialog>
        <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }


  async onCreated() {
    
    // document.addEventListener('DOMContentLoaded', function() {
      console.log('Create Calendar');
      let h1 = this.shadowRoot.querySelector('h1');
      let that = this;
      var calendarEl = this;
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        eventDisplay:'block',
        customButtons: {
          aButton: {
            text: '房A',
            click: function() {
                h1.innerHTML = '房A';
            }
          },
          bButton: {
            text: '房B',
            click: function() {
              h1.innerHTML = '房B';
            }
          },
          cButton: {
            text: '房C',
            click: function() {
              h1.innerHTML = '房C';
            }
          }
        },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'aButton bButton cButton'
        },
        displayEventTime:false,
          events: [
            {
              title: '紫砂療程(4pm-5pm)',
              start: '2021-09-29T16:00',
              end: '2021-09-29T17:00',
              // color: 'yellow',   // an option!
              // textColor: 'black'
            },
            {
              title: '軟紅外線療程(3pm-4pm)',
              start: '2021-09-24T15:00',
              end: '2021-09-24T16:00',
              // color: 'green',   // an option!
              // textColor: 'black'
            }
            // etc...
          ],
          dateClick: function(info) {
            console.log('Clicked on: ' + info.dateStr);
            console.log('Booking');
            let dzPopup = document.createElement('dz-booking-time-popup');
            dzPopup.width = '600px';
            dzPopup.height = '800px';
            dzPopup.date = info.dateStr;
            dzPopup.dialog =  that.shadowRoot.querySelector('vaadin-dialog');
            // dzPopup.dialog = dzWrap.shadowRoot.querySelector('vaadin-dialog');
            Dazzle.componentPopup(dzPopup, dzPopup.width, dzPopup.height);
          }
        
      });
      calendar.render();
    // });
  }
}

customElements.define(dzBookingPopup.is, dzBookingPopup);

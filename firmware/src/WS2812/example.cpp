#include <stdio.h>
#include <cmath>
#include "pico/stdlib.h"
#include "WS2812.hpp"

#define LED_PIN 25
#define LED_LENGTH 1

int main()
{
    stdio_init_all();

    // 0. Initialize LED strip
    printf("0. Initialize LED strip");
    WS2812 ledStrip(
        LED_PIN,            // Data line is connected to pin 0. (GP0)
        LED_LENGTH,         // Strip is 6 LEDs long.
        pio0,               // Use PIO 0 for creating the state machine.
        0,                  // Index of the state machine that will be created for controlling the LED strip
                            // You can have 4 state machines per PIO-Block up to 8 overall.
                            // See Chapter 3 in: https://datasheets.raspberrypi.org/rp2040/rp2040-datasheet.pdf
        WS2812::FORMAT_GRB  // Pixel format used by the LED strip
    );

    while (true) {
        // Pick a random color
        uint32_t color = (uint32_t)rand();
        // Pick a random direction
        int8_t dir = (rand() & 1 ? 1 : -1);
        // Setup start and end offsets for the loop
        uint8_t start = (dir > 0 ? 0 : LED_LENGTH);
        uint8_t end = (dir > 0 ? LED_LENGTH : 0);
        for (uint8_t ledIndex = start; ledIndex != end; ledIndex += dir) {
            ledStrip.setPixelColor(ledIndex, color);
            ledStrip.show();
            sleep_ms(50);
        }
    }

    return 0;
}

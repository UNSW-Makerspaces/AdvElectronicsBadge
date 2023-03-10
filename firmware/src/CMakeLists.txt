
add_executable(WS2812_Example 
        example.cpp
        WS2812.cpp
)

pico_generate_pio_header(WS2812_Example ${CMAKE_CURRENT_LIST_DIR}/WS2812.pio)

pico_enable_stdio_uart(WS2812_Example 1)
pico_enable_stdio_usb(WS2812_Example 1)

# Add the standard library to the build
target_link_libraries(WS2812_Example 
        pico_stdlib
)

# Add any user requested libraries
target_link_libraries(WS2812_Example
        hardware_pio
)

pico_add_extra_outputs(WS2812_Example)

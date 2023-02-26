## 1. High-Density Items

<br>
<br>
<ACard 
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 400px;"
variant="outline">
<small><center></center></small>
</ACard>
<small><center>Animation of placement of the main MCU, then its supporting components in order.</center></small> 
<br>

The rule of thumb in SMD assembly is to place components that are the *most flat*,
and *in the middle of a crowded group* first. 

Place: 

* J1 (USB-C Connector)
* XX (RP2040 Microcontroller)
* XX (WS2812-B LED)

This means that you can work your way outwards from the crowded centers. 

::: tip

Refer to the [interactive BOM tool][3] to make identifying components easier.

:::

[3]: <https://micl.dev/src/html/picogamepad_3_4_0_A> 

# Induction Overview

Welcome to the [Advanced Electronics][1] soldering induction's reference documentation. 

::: warning NOTICE

The version of this board (v3.4.0) is currently in the process of being released to be public, 
or is very new. This documentation, and the induction materials are **very likely** to 
be modified by staff. 

:::



<br>
<ACard 
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 300px;"
variant="outline">
<small><center>PICTURE OF SOLDERING INDUCTION BOARD</center></small>
</ACard>
<small><center> An example of one of the boards that are made in this induction </center></small> 
<br>

The induction provides students with the tools necessary for assembling the [PicoGamePad][2], 
which acts as a Game-Controller over USB-C. When properly assembled, it can act as a USB control
device for most common game consoles. 

The [microcontroller][2] that is used on the board, which does "the work", is the [RP2040][3], a novel
device recently released by [Raspberry Pi][4]. The board breaks out every spare [GPIO][5] pin of 
the microcontroller, and is designed such that it can be a ready replacement for other hobby-grade
development boards, such as the [Arduino UNO][6]. Detailed information about configuring the board
as either a gamepad, or using it as a microcontroller, is provided in the supplementary
documentation [on this page][7].

<br><br>
## Focus Points 

<br>

### Surface Mounted Electronics

A key focus of this induction, is to introduce students to newer electronics assembly processes. 
Namely, [Surface-Mounted Devices][8] (SMD).

<br>
<ACard 
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 150px;"
variant="outline">
<small><center>EXAMPLES OF SURFACE MOUNTED PACKAGING</center></small>
</ACard>
<small><center>Some examples of Surface-Mounted components.</center></small> 
<br>

Assembling SMD devices on boards is becoming more common, but is something that is generally too
difficult to do with soldering irons (which is taught for the introductory induction). As surface
mounted packaging is cheaper, more common, and increasingly popular; the Advanced Electronics 
badge fills the gaps for students interested in more modern techniques. 

<br>

### PCB Schematic and Board Markings

[Printed Circuit Boards][9] are typically designed so that it is clear for the user, and the
fabrication and assembly services where and how certain components should be used. This includes:

* Identification of components with [Reference Designators][10]. 
* Package silkscreen [outlines][11] for alignment and orientation.
* Fabrication markings such as [fiducials][12] and [names][13].
* Assembly markings, such as when to leave a component off the board ([DNP][14]).

<br> 

### Reflow Curves

The process of pre-heating and oven-induced solder melting, to form connections between the pads
of a PCB, and the pins of a component, is generally referred to as [reflow soldering][15]. If a PCB
is heated too quickly, or to too high of a temperature, it can [fail][16]. Alternatively, different
solder alloys, types, and brands, may differ in properties.

This topic is covered in more detail throughout the induction. 

[1]:  / ""
[2]:  / ""
[3]:  / ""
[4]:  / ""
[5]:  / ""
[6]:  / ""
[7]:  / ""
[8]:  / ""
[9]:  / ""
[10]: / ""
[11]: / ""
[12]: / ""
[13]: / ""
[14]: / ""
[15]: / ""
[16]: / ""
[17]: / ""
[18]: / ""
[19]: / ""

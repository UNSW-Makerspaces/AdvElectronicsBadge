# Induction Overview

Welcome to the [Advanced Electronics][^1] soldering induction's reference documentation. 

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

The induction provides students with the tools necessary for assembling the [PicoGamePad][^2], 
which acts as a Game-Controller over USB-C. When properly assembled, it can act as a USB control
device for most common game consoles. 

The [microcontroller][^2] that is used on the board, which does "the work", is the [RP2040][^3], a novel
device recently released by [Raspberry Pi][^4]. The board breaks out every spare [GPIO][^5] pin of 
the microcontroller, and is designed such that it can be a ready replacement for other hobby-grade
development boards, such as the [Arduino UNO][^6]. Detailed information about configuring the board
as either a gamepad, or using it as a microcontroller, is provided in the supplementary
documentation [on this page][^7].

<br/>

<!--@include: ./focus-points.md-->

<br/> 

<!--@include: ./references.md-->

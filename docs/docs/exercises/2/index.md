# <AChip class="rounded-0"><h1 color="inherit">Part 2:</h1></AChip> Component Placement 
<br> 

This part of the exercise, is fairly straight forward. The <u>surface mounted</u> components need to 
be placed onto the PCB, above the solderpaste that was printed onto the boards previously in
[Part 1][1].

<br>
<ACard 
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 400px;"
variant="outline">
<small><center></center></small>
</ACard>

::: tip

The order at which you choose to place components may make it easier or harder to place other
components. You can choose a different order of assembly to the one provided in this part, 
but be aware of how accessible certain components are. 

:::

<br>

## i. Reference Designators & Values

<br> 

Generally, the convention of indicating "which component" to "put where" for a PCB, is for the 
author of the board design to provide numbered markings on the [Silkscreen][2]. The standard
for what letter(s) to use for what component differs by author or schematic, but generally the 
common conventions are: 

::: details Reference Designators

<AAlert color="warning">Not a high priority item for documentation</AAlert>

:::

Some examples on the induction board are also shown below. The `value` of a component, generally
refers to some parameter or property it holds that is important or significant to operation.

## 1. High-Density Items

<br>
<br>
<ACard 
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 400px;"
variant="outline">
<small><center>GIF of placing RP2040 then other components.</center></small>
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


## 2. Resistors, Capacitors, Fuse 

<br> 

After the high-density components are on the board, carefully place the **small** surface 
mounted [passive components][4] around the placed components. 

::: tip 

This step requires tweezers to be used for accurate placement. If your component is "at an angle"
or "slightly off", it actually **should not matter** for the reflow step. The heat, and molten
solder, will pull it "back into place" ontop of the pad. 

You only need to have it cover about 50% of each pad for this step.

:::

<!-- {{{1 Passive Components: col-2 row-2 -->

<br>

<div class="grid-row sm:grid-cols-2 pl-5" >

<div class="ps-1"> 
<ACard 
class="w-full"
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 200px;"
variant="outline">
<div style="width:300px;height:100px"/>
</ACard>
</div>

<div>
<ACard 
class="ps-1"
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 200px;"
variant="outline">

<div style="width:300px;height:100px"/>
</ACard>
</div>

<div>
<ACard 
class="ps-1"
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 200px;"
variant="outline">

<div style="width:300px;height:100px"/>
</ACard>
</div>

<div>
<ACard 
class="ps-1"
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 200px;"
variant="outline">
<div style="width:300px;height:100px"/>
</ACard>
</div>

</div>
<br>

<!-- }}} -->

::: details Reference Designators

<AAlert color="warning">Not a high priority item for documentation</AAlert>

:::

## 3. Flash Memory IC

<br>
<ACard 
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 300px;"
variant="outline">
<small><center>IMAGE OF W25Q FLASH MEMORY, CIRCLE INDEX</center></small>
</ACard>
<small><center>Flash Memory IC, with index marker highlighted.</center></small> 
<br>

The final component to place, should be the flash memory. This component is used to store
programs for the microcontroller to run. 

Pay attention to the marking on the black plastic the component is made of. You should have 
the "circle" be in the same orientation as the RP2040 (which also has a circle in one corner). 

The dot on the package, indicates where pin/pad "1" is. Ensure that the orientation of both 
components is correct, or your board will not work!

::: tip
The index pin position, including other useful information, can be found with the 
interactive BOM tool mentioned [earlier][3].
:::


## 4. Inspection

<br> 

::: warning 
Content for this section will rely on some examples being made, probably by students. 

For now, I don't have enough good examples to show off!
:::

Before the reflow step, check to make sure all of your components are in the correct 
position or place and **that the orientation of components is correct!**

<br>
<br>

[3]:  "https://unsw-makerspaces.github.io/ElectronicsInduction/public/picogamepad_3_4_0_A.html" "Interactive BOM"


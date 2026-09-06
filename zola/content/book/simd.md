# SIMD

## Single core performance

CPUs are designed to execute as many operations as quickly as possible. Perhaps the simplest example of a program is one that takes two large lists of numbers and adds them together.

```c
void add_vectors(uint32_t *a, uint32_t *b, uint32_t *c, size_t n) {
    for (size_t i = 0; i < n; i++) {
        c[i] = a[i] + b[i];
    }
}
```

This program is compiled into a sequence of assembly instructions that consists of two loads, and add, and one write. This realization brings us to a key limit of computers: In order to perform an operation, data must first be physically moved to the CPU.

#### Caches

People desining computers quickly noticed that moving elelectricity even relatively small distances can take much longer than a single operation. If a bank of memory contains 1GB of transistors, then the furthest byte from the cpu has to be at least 1 million transistors away. In reality, the memory is even further away.

The solution to this is caches. If you have fewer transistors, your memory can be closer to the CPU. Thus, reading a unit of memory from different devices has different latencies, and thus different maximum bandwidths.

Since memory transfers tend to take much more time than operations, and so the biggest lever for improving performance is memory latency.

#### Where did your memory start from

If your algorithm uses more memory than can fit in one of the memory levels, then you are likely to have to wait the required latency for each unit of memory you fetch.

It is important to note that a single unit of memory is typical much larger than a byte. Most commonly for a single cache line is loaded as 64 bytes, while your DRAM (the big one) loads rows of size 1024 bytes all at once, although this is ultimately a simplification.

#### Memory-bound

Lets say our algorithm above has `n` large enough that it has to fetch every element from main memory, no matter how many times in a row we run it.

It takes `k` ns to load the first unit of `b` bytes, after which the CPU can start performing some instructions.

##### Pipelining

This is where the CPUs first trick comes in. A cpu can perform multiple instructions at once. Not in parallel, but in sequence. At at the same time.

A CPU pipeline breaks an instruction into a sequence of parts that each uses different transistors. Say a single `ADD` instruction is broken into 4 parts: `DECODE ADD_FRONT ADD_END ADD_CARRY`. Of course this breakdown is not common. Using a pipeline we could operate on all 4 of these parts at the same time, just using different instructions at each point in time.

If `b=8*4`, we have enough data to perform 4 32-bit additions (that is, 16 32-bit values). Let's see what that looks like with pipelining.

```
| timestep | stage decode | stage add front | stage add end | stage add carry | 
| 0        | ADD[0]       |                 |               |                 |
| 1        | ADD[1]       | ADD[0]          |               |                 |
| 2        | ADD[2]       | ADD[1]          | ADD[0]        |                 |
| 3        | ADD[3]       | ADD[2]          | ADD[1]        | ADD[0]         |
| 4
| 5
| 6
| 7 
```

When an instruction is executed, it starts in the first pipeline stage. When it completes that stage, it moves to the next stage. Every pipeline stage is executed in parallel, so if you have `S` stages, you can perform `S` i structions in `S` cycles. This sounds like 1 instruction per cycle, but this typically allows the clock speed to increase, and for instructions to be more complicated. So it's a win-win!

#### Back to memory-bound

We saw what happens when all the pipeline stages are full. If this is the case, your CPU is doing as much as it can. There's no more performance to be had.

However, memory is really slow. Here's some arbitrary stick of DDR4 RAM **TODO**. The important pieces of data here are:
- DDR and 3200 tell us that the memory controller can clock the RAM at 1600MHz Mhz, half of the effective rate die to double data rate.
- RAM often advertises a set of timing parameters, such as 16-18-18-38. These are, in order:
  - CL (CAS Latency) refers to the number of cycles required to access memory if the row is already pre-charged. A sort of best-case latency if accessing memory in-order.
  - tRCD (Row to Columns Delay) The delay between activating a row and accessing a column in that row.
  - tRP (Row Precharge Time) How many clock cycles it takes to close one row of memory before opening another.
  - tRAS (Row Active Time) The minimum number of clock cycles a row must be active, to ensure data is fully accessed. DRAM must read and write an entire row, no matter how many elements you access, so this is a strict lower bound on the random access speed.

Assuming our CPU has double the clock speed of the memory, we should expect to have to wait at least 32 clock cycles to perform each memory access, 64 clock cycles for the first row, in a sequence, and 100 clock cycles if the last row was different. In our example, we were only able to feed the pipeline for X cycles, so if we ignore our cache and assume we have a perfect access pattern, we would be stuck operating only 8 instructions every 32 clock cycles!

#### Caches

As a brief aside, if our data happens to be small enough to fit all in cache, we can expect mucu higher memory performance, after the data is loaded into cache the first time.

- L1 - 3 cycles
- L2 - 12 cycles
- L3 - 120 cycles?
- DRAM - 240 cycles?

#### Sequential memory throughput

If our memory could sustain a maximum of 8 bytes per 15 memory clock cycles at 1600Mhz, it could transfer 0.85GB every second. That sounds like a lot, but we can do better, and we also don't even get that for free!

Memory is transferred in bursts of 64 bytes. On a 64-bit system, an address has 8 bytes, and so a word is 8 bytes long. When we were talking about latency above, that was the time between our READ request and the first word of data. The great part about DDR is that data is transferred twice per clock cycle, so we should expect a single burst to be transferred in only 4 memory clock cycles. 
- The transfer rate depends on the DDR number. 3200MT/s stands for 3200M transfers per second, where each transfer is 8 bytes (1 word). But how do we get here? 3200MT/s is ~52GB/s! What are we missing?

Next is rows. Rows are typically 8KB, but it varies by device. When your memory activates a segment of memory, it's this large. In order to minimize latency, you want to read every byte in a row. In order to minimize power usage, you also want to read every byte in a row!

Rows are read by memory banks. A DDR4 stick typically has about 100 banks, although there are some slight restrictions about which banks can serve which requests. Large portions of the chip are restricted to sets of 16 banks that have small amounts of resource sharing that increases latency slightly when switching between them. Each bank contains a row buffer and has the job of serving reads from a specific row. In order to get full usage, memory pipelines reads between different memory banks. This means that while a burst from one row is being transferred, another row might be activating so that when the current transfer is done, the next can start immediately streaming its burst.

### SIMD

Now that we understand memory bandwidth, we understand that our memory needs to be organized properly in order to get it to the CPU fast enough that we can operate on it. Perhaps not surprisingly, at 1 word (8 bytes) per clock cycle from thr DRAM, the CPU can be active most of the time. Given instruction latencies typically stretch from 1 to 16 cycles, you can be doing work pretty regularly. And so this nearly begs the question as to whether we really need caches if memory transfers are so fast anyways.

But we forget about pipelines. Many instructions without dependencies can reach instruction throughputs of 0.5 or even 0.33. Thus, in order to perform 3 64-bit adds in a single clock cycle, we need 6 words of memory. And so we're 6 times short.

And now we can finally talk about this chapter's namesake: SIMD. You can view it from two points of view. The first, and also less impressive, is by analyzing its name. Single Instruction Multiple Data. One instruction that operates on multiple data points decreases the instruction bandwidth. The memory / cache doesn't have to store 4 instructions that are almost identical. Sure, this is great, but it's not game changing.

The second point of view is crazy. We can already do multiple instructions per clock cycle through pipelineing & the use of psrallal ALUs, but now each instruction operation does more than one operation at once. This maybe seems lame except for the fact that we get the same pipelining guarantees with these kinds of instructions.

And now, our DRAM is really lacking. (Let's use the x64 ISA. With SIMD you care much more about which operations your specific CPU supports.
- In order to drive 3 parallel dual-word adds (`_mm64`) in a single clock cycle, we need 12 words of memory.
- For `__m128` (SSE) we need 24 words.
- For `_mm256` (AVX2) we need 48 words.
- For `__m512` (AVX512) we would need 96 words!
- To load 2 32-float adds using Hexagon's HVX (1024 bit) we would 128 floats!

Although the holy grail of simd is the FMAD, or fused multiply add. It performs a * b + c. AVX512 can run two per cycle. That's 4 effective ops, 6 * 512 bits -> still 96 floats.

### CPU Faults

What happens if you try to execute a simd instruction your CPU doesn't support?

#### Typical way to support multi-simd versions

__cpuid_count()

### Thermal throttling?

## Multi-core performance

No clue how this one works

### Even more thermal throttling?

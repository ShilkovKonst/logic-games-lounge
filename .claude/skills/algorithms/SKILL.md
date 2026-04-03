---
name: algorithms
description: >
  Use this skill for algorithm design, complexity analysis, data structure selection,
  and optimisation problems. Trigger when the user asks about performance of code,
  asks "what's the best way to...", needs a sorting/searching/graph/tree/DP solution,
  is working on competitive-programming-style problems, or needs to prove correctness
  of an algorithm. Also trigger for: Big-O analysis, space-time tradeoffs, cache
  efficiency, SIMD/vectorisation opportunities, and choosing between data structures.
allowed-tools: Read, Write, Bash
---

# Algorithms Skill

Think before you code. For non-trivial problems, derive the algorithm analytically
before implementation. State complexity explicitly. Prove or argue correctness.

## Problem Analysis Framework

Before proposing a solution, answer:
1. **Input constraints** — size `n`, value ranges, duplicates allowed?
2. **Output requirements** — exact answer, approximate, streaming?
3. **Complexity budget** — what's acceptable? (check PROJECT constraints below)
4. **Special structure** — sorted? sparse? DAG? integer keys?
5. **Online vs offline** — all data upfront, or arriving in stream?

## Complexity Budget
- **Latency SLA:** Move generation runs synchronously on the browser main thread. Must complete in <16 ms to maintain 60 fps. In practice the chess engine generates moves in <1 ms (board is tiny), but any new algorithm must preserve this.
- **Data size:** Board = 8×8 = 64 cells. Active pieces ≤ 32 (n is effectively constant). `boardMap = Map<string, PieceType>` gives O(1) cell lookup; prefer `boardMap.get(id)` over `board.find()` (O(n)) in hot paths.
- **Memory:** Browser JS heap. No explicit budget, but avoid allocating large objects in hot move-generation loops. Avoid creating new objects inside per-cell iteration; prefer reusing arrays where possible.

## Algorithm Selection Guide

### Searching & Sorting
| Problem | Structure | Algorithm | Complexity |
|---------|-----------|-----------|------------|
| Sort general | array | Timsort / pdqsort | O(n log n) |
| Sort integers, small range | array | Counting / Radix sort | O(n + k) |
| Find in sorted | array | Binary search | O(log n) |
| Top-k | array | Quickselect / heap | O(n) / O(n log k) |
| Order statistics | dynamic | Augmented BST / BIT | O(log n) |

### Graph Algorithms
| Problem | Algorithm | Complexity | Notes |
|---------|-----------|------------|-------|
| Shortest path, unit weight | BFS | O(V+E) | |
| Shortest path, weighted | Dijkstra | O((V+E) log V) | Non-negative weights |
| Shortest path, negative | Bellman-Ford | O(VE) | Detect neg cycles |
| All-pairs shortest path | Floyd-Warshall | O(V³) | Small V |
| MST | Kruskal / Prim | O(E log V) | |
| Topological sort | DFS / Kahn's | O(V+E) | DAGs only |
| SCC | Kosaraju / Tarjan | O(V+E) | |
| Max flow | Dinic's | O(V²E) | Unit cap: O(E√V) |
| Bipartite matching | Hopcroft-Karp | O(E√V) | |

### Dynamic Programming Checklist
- [ ] Define subproblem clearly: `dp[i]` means...
- [ ] Base cases
- [ ] Recurrence relation with justification
- [ ] Iteration order (bottom-up) or memoisation (top-down)
- [ ] Space optimisation (rolling array if only previous row needed)
- Common patterns: LCS, LIS, knapsack, interval DP, bitmask DP, tree DP

### Data Structures
| Need | Structure | Notes |
|------|-----------|-------|
| Fast insert/delete/lookup | Hash map | O(1) amortised |
| Ordered + range queries | BST / sorted array | O(log n) |
| Prefix sums, range updates | Fenwick tree (BIT) | O(log n) |
| Range min/max queries | Sparse table / segment tree | O(1) query / O(log n) update |
| Union-Find | DSU with path compression | O(α(n)) |
| LRU cache | Hash map + doubly linked list | O(1) |
| Priority queue | Binary heap | O(log n) push/pop |
| Sliding window min/max | Monotonic deque | O(n) |
| String search | KMP / Aho-Corasick / suffix array | O(n+m) / O(n) |

### Probabilistic & Approximate
- Bloom filter — membership with false positives, no false negatives
- HyperLogLog — cardinality estimation
- Count-Min Sketch — frequency estimation
- MinHash / LSH — similarity search

## Correctness Proof Approaches
- **Induction** — base case + inductive step
- **Loop invariant** — state what holds before/after each iteration
- **Contradiction** — assume algorithm wrong, derive impossibility
- **Exchange argument** — for greedy: show swapping doesn't improve solution

## Output Format

For any non-trivial algorithm:
```
Problem restatement: <in your own words>
Key insight: <the non-obvious observation that enables the solution>
Algorithm:
  1. <step>
  2. <step>
Time complexity: O(...) — <justification>
Space complexity: O(...) — <justification>
Correctness argument: <brief proof or invariant>
Edge cases handled: <list>
Implementation notes: <gotchas, overflow risks, precision issues>
```

Then produce the implementation.

## Optimisation Checklist (after correctness)
- [ ] Cache-friendly memory access patterns (row-major, struct-of-arrays)
- [ ] Avoid unnecessary allocations in hot loops
- [ ] Integer arithmetic where float isn't needed
- [ ] Bitwise ops for power-of-2 arithmetic
- [ ] Early termination / pruning
- [ ] SIMD opportunities (not applicable — TypeScript browser environment)
- **Project profiling:** Use browser DevTools Performance tab. Known hotspot: `getAllActiveMoveSets` called after every move to recalculate all opponent moves (for check/checkmate detection). Known allocation hotspot: `workingBoard.map(p => ({ ...p }))` creates 32 new objects per move even when only 2-3 pieces change. Future optimisation: incremental moveSet recalculation for only pieces affected by the last move.
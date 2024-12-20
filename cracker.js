class Corner
{
    constructor(ID)
    {
        this.ID = ID;
        this.data = generateArbitrarySequence(9, ID, true); // Assuming you're working with 2D arrays
    }

    checkOther(other, isHorizontal)
    {
        // Compare all three rows/columns
        for (let i = 0; i < 3; i++) // Use 3 instead of 2 for all rows/columns
        {
            const chunk1 = this.getChunk(i, isHorizontal);
            const chunk2 = other.getChunk(i, isHorizontal);

            if (arraysCommonElem(chunk1, chunk2))
            {
                const direction = isHorizontal ? "row" : "column";
                const sharedElements = chunk1.filter(element => chunk2.includes(element));
                showFailures
                    ? console.log(
                        `REJECT! Common elements found in ${direction} ${i + 1}: ${sharedElements.join(', ')}`
                    )
                    : undefined;
                return false;
            }
        }

        return true;
    }

    getChunk(index, isHorizontal)
    {
        // Correct chunk extraction for rows or columns
        if (isHorizontal)
        {
            return this.data[index]; // Extract the whole row
        }
        else
        {
            return this.data.map(row => row[index]); // Extract the whole column
        }
    }
}

class Board
{
    constructor()
    {
        this.TL = null;
        this.TR = null;
        this.BL = null;
        this.BR = null;
    }

    calculateUntil(numberOfHits)
    {
        let hits = 0;

        for (let ind1 = 0; ind1 < nineFactorial; ind1++)
        {
            this.TL = new Corner(ind1);

            for (let ind2 = 0; ind2 < nineFactorial; ind2++)
            {
                this.TR = new Corner(ind2);

                if (!this.TL.checkOther(this.TR, true)) continue;

                for (let ind3 = 0; ind3 < nineFactorial; ind3++)
                {
                    this.BL = new Corner(ind3);

                    if (!this.TL.checkOther(this.BL, false)) continue;

                    for (let ind4 = 0; ind4 < nineFactorial; ind4++)
                    {
                        this.BR = new Corner(ind4);

                        // Forward checks
                        if (!this.TR.checkOther(this.BR, false)) continue;
                        if (!this.BL.checkOther(this.BR, true)) continue;

                        // Backward checks
                        if (!this.BR.checkOther(this.TR, false)) continue;
                        if (!this.BR.checkOther(this.BL, true)) continue;

                        // If all checks pass, we have a valid board
                        generateTableEntry(ind1, ind2, ind3, ind4);
                        hits++;

                        if (hits >= numberOfHits) return; // Stop when we've found enough valid boards
                    }
                }
            }
        }
    }
}

// Helper function to find common elements between two arrays
function arraysCommonElem(arr1, arr2)
{
    return arr1.filter(element => arr2.includes(element)).length > 0;
}

// Factorial helper function
function Factorial(n)
{
    if (n === 0 || n === 1)
    {
        return 1;
    }

    return n * Factorial(n - 1);
}

// Generate sequence with optional 2D formatting
function generateArbitrarySequence(length, index, to2D = false)
{
    if (index > Factorial(length) - 1)
    {
        return console.error("Error: Invalid Index");
    }

    const numbers = Array.from({ length }, (_, i) => i + 1);
    const sequence = [];

    for (let i = length; i > 0; i--)
    {
        const factorial = Factorial(i - 1);
        const position = Math.floor(index / factorial);
        sequence.push(numbers.splice(position, 1)[0]);
        index %= factorial;
    }

    if (to2D && Math.sqrt(length) % 1 === 0)
    {
        const size = Math.sqrt(length);
        const twoDArray = [];
        for (let i = 0; i < size; i++)
        {
            twoDArray.push(sequence.slice(i * size, (i + 1) * size));
        }
        return twoDArray;
    }

    return sequence;
}

// Convert indices to 2D arrays for validation
function indicesToArrays(index1, index2, index3, index4)
{
    const topLeft = generateArbitrarySequence(9, index1, true);
    const topRight = generateArbitrarySequence(9, index2, true);
    const bottomLeft = generateArbitrarySequence(9, index3, true);
    const bottomRight = generateArbitrarySequence(9, index4, true);

    return { topLeft, topRight, bottomLeft, bottomRight };
}

const nineFactorial = 362880;
var showFailures = false;
var board = new Board();

document.addEventListener("DOMContentLoaded", () => {
    // Ask the user how many boards to calculate
    const numberOfBoards = parseInt(prompt("How many Sudoku boards would you like to calculate?"), 10);

    if (isNaN(numberOfBoards) || numberOfBoards <= 0) {
        alert("Please enter a valid positive number.");
        return;
    }

    // Show "Processing..." message
    const processingMessage = document.createElement("div");
    processingMessage.id = "processingMessage";
    processingMessage.textContent = "Processing...";
    processingMessage.style.fontSize = "20px";
    processingMessage.style.marginTop = "20px";
    document.body.appendChild(processingMessage);

    // Perform the calculation asynchronously
    setTimeout(() => {
        board.calculateUntil(numberOfBoards);

        // Remove "Processing..." message when done
        processingMessage.remove();
        alert("Calculation complete!");
    }, 100); // Delay to allow "Processing..." message to render
});

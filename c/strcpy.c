#import <stdio.h>
#import <stdlib.h>
#import <string.h>

//forward declarations
char* string_copy_iter(char* destination, const char* source);
char* string_copy_recur(char* destination, const char* source);
//char* strcpy(char *s1, const char *s2);


int
main(int argc, char* argv[]) {

/*	Security risk:
 *	 	 	~buffer overflow~ 
 *			if using a string copy function with a source string of unknown size
 *			(for example: using the gets() function)
 *			or simply failing to set a destination as large or larger
 *				 than the source + null byte.
 *	  		strcpy could overwrite the stack frame and cause unpredictable behaviour
 *		 		or be exploited my an attacker.
 */

	char* temp_dest;
	char* final_dest;
	char* str = "This is the test string";

	// allocate the correct amount of memory
	int i;
	i = strlen(str);
	temp_dest = (char*) malloc (i + 1); 
	final_dest = (char*) malloc (i + 1); 


	printf("The test string requires: %d + 1 bytes in memory\n", i );

	strcpy(temp_dest, str);
	strcpy(final_dest, temp_dest);
	printf("Copy with strcpy : %s\n", final_dest);

	string_copy_iter(temp_dest, str);
	string_copy_iter(final_dest, temp_dest);
	printf("Copy by iterating : %s\n", final_dest);

	string_copy_recur(temp_dest, str);
	string_copy_recur(final_dest, temp_dest);
	printf("Copy by recursing : %s\n", final_dest);


	return(0);
}

char * 
string_copy_iter(char* destination, const char* source) {

	while (*source) {
		*destination = *source;
		destination++;
		source++;
	}

	//null terminate the string
	*destination = '\0';
	return destination;
}

/*
 * 	Security risk:
 *   		~Body recursion~ 
 *			bears a risk of stack overflow, or a buffer overflow on the space allocated the call stack
 *
 * 			better to use tail recursion:
 * 			"it often asymptotically reduces stack space requirements
 * 				from linear, or O(n), to constant, or O(1)."
 */
 
char *
string_copy_recur(char* destination, const char* source) {

	*destination = *source;

	if (!*source) {
		// null terminate
		*destination = '\0';
		return destination;	
	} else {
		// tail recurse
		return string_copy_recur( destination + 1, source + 1 );
	}
}

